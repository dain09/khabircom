
import { GoogleGenAI } from "@google/genai";
import { getApiKeys } from './apiKeyManager';
import { t } from './localizationService';

export const EGYPTIAN_PERSONA_INSTRUCTION = () => t('personas.egyptian');

// Helper utility for waiting (used in backoff)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to mask API keys for safe logging
const maskKey = (key: string) => {
    if (typeof key !== 'string' || key.length < 8) return '...';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

// Smart retry wrapper specifically for network flakes
const retryWithBackoff = async <T>(
    fn: () => Promise<T>, 
    retries = 3, 
    delay = 1000
): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        // We mainly want to retry on network errors (fetch failed) or 5xx (server errors)
        const isNetworkError = error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch');
        const isServerError = error.status >= 500 && error.status < 600;

        if (retries > 0 && (isNetworkError || isServerError)) {
            console.warn(`Network/Server glitch detected. Retrying in ${delay}ms... (${retries} attempts left)`);
            await wait(delay);
            return retryWithBackoff(fn, retries - 1, delay * 2); // Exponential backoff
        }
        throw error;
    }
};

// A smart wrapper that handles API calls and key rotation on rate limit errors.
export const withApiKeyRotation = async <T>(apiCall: (ai: GoogleGenAI) => Promise<T>): Promise<T> => {
    let keys = getApiKeys();
    
    // Fallback: If no keys in storage, check environment variables.
    if (keys.length === 0) {
        let envKeysString = '';
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEYS) {
            envKeysString = import.meta.env.VITE_API_KEYS;
        }
        // @ts-ignore
        else if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            // @ts-ignore
            envKeysString = process.env.API_KEY;
        }

        if (envKeysString) {
             const newKeys = envKeysString.split(',').map(k => k.trim()).filter(k => k.length > 0);
             if (newKeys.length > 0) {
                 keys = newKeys;
             }
        }
    }
    
    if (keys.length === 0) {
        throw new Error(t('errors.noApiKeys'));
    }

    const totalKeys = keys.length;
    let lastError: any = null;

    for (let i = 0; i < totalKeys; i++) {
        const currentKey = keys[i];
        
        try {
            console.log(`Attempting API call with key: ${maskKey(currentKey)}`);
            const ai = new GoogleGenAI({ apiKey: currentKey });
            // Wrap the actual API call in our network retry logic
            return await retryWithBackoff(() => apiCall(ai));
        } catch (error: any) {
            lastError = error;
            const isRateLimitError = error.toString().includes('429');
            
            if (isRateLimitError) {
                console.warn(`API key rate limited: ${maskKey(currentKey)}. Rotating to the next key...`);
                // Continue to the next key
            } else {
                // If it's any other error (e.g., invalid key, server error), stop and re-throw
                console.error(`API call failed with non-retriable error for key ${maskKey(currentKey)}:`, error);
                throw error;
            }
        }
    }

    // If we've exhausted all keys and they were all rate-limited
    console.error("All available API keys are rate-limited.");
    throw lastError || new Error("All API keys failed.");
};


// Test if a given API key is valid by making a simple, non-streaming call.
export const testApiKey = async (apiKey: string): Promise<boolean> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        await ai.models.generateContent({model: 'gemini-flash-latest', contents: 'test'});
        return true;
    } catch (error) {
        console.error(`API Key test failed for key ${maskKey(apiKey)}:`, error);
        return false;
    }
};
