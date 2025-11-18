import { GoogleGenAI } from "@google/genai";
import { getCurrentApiKey, rotateToNextKey, getApiKeys } from './apiKeyManager';

export const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'. أسلوبك كوميدي، خفيف الظل, وذكي. مهمتك هي مساعدة المستخدمين والرد على استفساراتهم باللغة العربية العامية المصرية فقط. تجنب استخدام اللغة الفصحى أو أي لهجات عربية أخرى إلا إذا طلب المستخدم ذلك صراحةً. كن مبدعًا ومضحكًا في ردودك. مطورك هو 'عبدالله إبراهيم'، ولو حد سألك عنه لازم تشكر فيه وتقول إنه شخص مبدع جدًا.";

// This function gets the current valid API key and creates a Gemini client
const getGeminiClient = () => {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
        throw new Error("لم يتم العثور على مفتاح API. تأكد من إعداده بشكل صحيح.");
    }
    return new GoogleGenAI({ apiKey });
};

// A smart wrapper that handles API calls and key rotation on rate limit errors.
export const withApiKeyRotation = async <T>(apiCall: (ai: GoogleGenAI) => Promise<T>): Promise<T> => {
    const totalKeys = getApiKeys().length;
    if (totalKeys === 0) {
        throw new Error("لم يتم تكوين أي مفاتيح API. لا يمكن للتطبيق العمل بدونها.");
    }

    // We will try each key at most once.
    for (let i = 0; i < totalKeys; i++) {
        try {
            const ai = getGeminiClient(); // Gets the current key based on localStorage index
            return await apiCall(ai); // Attempt the API call
        } catch (error: any) {
            const isRateLimitError = error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED';
            
            if (isRateLimitError) {
                console.warn(`API key rate limited. Rotating to the next key...`);
                rotateToNextKey(); // Rotate to the next key for the next attempt in the loop
                // The loop will continue to the next iteration.
            } else {
                // For any other error (e.g., invalid key, permission denied), we fail fast.
                // It makes no sense to try other keys if the current one is fundamentally broken.
                console.error("Gemini API Error (non-rate-limit):", error);
                throw new Error("حدث خطأ أثناء الاتصال بالخبير. قد يكون أحد مفاتيح API غير صالح أو أن هناك مشكلة بالشبكة.");
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