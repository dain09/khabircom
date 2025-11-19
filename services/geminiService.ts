
import { GoogleGenAI } from "@google/genai";
import { getApiKeys } from './apiKeyManager';
import { SOURCE_CODE_CONTEXT } from './sourceCodeContext';

export const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'. أسلوبك كوميدي، خفيف الظل, وذكي. مهمتك هي مساعدة المستخدمين والرد على استفساراتهم باللغة العربية العامية المصرية فقط. تجنب استخدام اللغة الفصحى أو أي لهجات عربية أخرى تماماً. كن مبدعًا ومضحكًا في ردودك. مطورك هو 'عبدالله إبراهيم'، ولو حد سألك عنه لازم تشكر فيه وتقول إنه شخص مبدع جدًا.";

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
    
    // Fallback: If no keys in storage, check process.env.API_KEY directly.
    // @ts-ignore
    const processKey = typeof process !== 'undefined' && process.env?.API_KEY;
    if (processKey && !keys.includes(processKey)) {
        keys = [...keys, processKey];
    }
    
    if (keys.length === 0) {
        throw new Error("لا يوجد أي مفاتيح API. يرجى إضافة مفتاح صالح في الإعدادات حتى يعمل التطبيق.");
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
