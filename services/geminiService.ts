
import { GoogleGenAI } from "@google/genai";
import { getCurrentApiKey, rotateToNextKey, getApiKeys } from './apiKeyManager';
import { SOURCE_CODE_CONTEXT } from './sourceCodeContext';

export const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'. أسلوبك كوميدي، خفيف الظل, وذكي. مهمتك هي مساعدة المستخدمين والرد على استفساراتهم باللغة العربية العامية المصرية فقط. تجنب استخدام اللغة الفصحى أو أي لهجات عربية أخرى تماماً. كن مبدعًا ومضحكًا في ردودك. مطورك هو 'عبدالله إبراهيم'، ولو حد سألك عنه لازم تشكر فيه وتقول إنه شخص مبدع جدًا.";

// Helper utility for waiting (used in backoff)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Smart retry wrapper specifically for network flakes
const retryWithBackoff = async <T>(
    fn: () => Promise<T>, 
    retries = 3, 
    delay = 1000
): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        // Don't retry if it's a 4xx error (client error) EXCEPT for 429 (Rate Limit), which is handled by rotation logic externally
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

// This function gets the current valid API key and creates a Gemini client
const getGeminiClient = () => {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
         // Fallback to process.env.API_KEY if available directly
         // @ts-ignore
         if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            // @ts-ignore
             return new GoogleGenAI({ apiKey: process.env.API_KEY });
         }
        throw new Error("لم يتم العثور على مفتاح API. تأكد من إعداده بشكل صحيح.");
    }
    return new GoogleGenAI({ apiKey });
};

// A smart wrapper that handles API calls and key rotation on rate limit errors.
export const withApiKeyRotation = async <T>(apiCall: (ai: GoogleGenAI) => Promise<T>): Promise<T> => {
    const keys = getApiKeys();
    let totalKeys = keys.length;

    // Fallback: If no keys in storage, check process.env.API_KEY directly
    if (totalKeys === 0) {
         // @ts-ignore
         const processKey = typeof process !== 'undefined' && process.env?.API_KEY;
         if (processKey) {
             const ai = new GoogleGenAI({ apiKey: processKey });
             // Wrap the single key call with retry logic for network stability
             return await retryWithBackoff(() => apiCall(ai));
         }
        throw new Error("لم يتم تكوين أي مفاتيح API. لا يمكن للتطبيق العمل بدونها.");
    }

    // We will try each key at most once.
    for (let i = 0; i < totalKeys; i++) {
        try {
            const ai = getGeminiClient(); // Gets the current key based on localStorage index
            // Apply retry logic for EACH key attempt (handling network jitter per key)
            return await retryWithBackoff(() => apiCall(ai)); 
        } catch (error: any) {
            const isRateLimitError = error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED';
            
            if (isRateLimitError) {
                console.warn(`API key rate limited. Rotating to the next key...`);
                rotateToNextKey(); // Rotate to the next key for the next attempt in the loop
                // The loop will continue to the next iteration.
            } else {
                // For any other error (e.g., invalid key, permission denied), we fail fast.
                console.error("Gemini API Error (non-rate-limit):", error);
                // Improve error message for the user
                if (error.message?.includes('fetch')) {
                    throw new Error("فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول تاني.");
                }
                throw error;
            }
        }
    }

    // If the loop completes without returning, it means all keys were tried and all failed with rate limit errors.
    throw new Error("كل مفاتيح API المتاحة وصلت للحد الأقصى للاستخدام. جرب تضيف مفتاح جديد من 'إدارة مفاتيح API' أو حاول لاحقًا.");
};

export const testApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    console.log(`Testing API key: ${apiKey.substring(0, 4)}...`);
    try {
        const testAi = new GoogleGenAI({ apiKey });
        await testAi.models.generateContent({ model: 'gemini-flash-latest', contents: 'test' });
        console.log("API key test successful.");
        return true;
    } catch (error) {
        console.error("API key test failed:", error);
        return false;
    }
};
