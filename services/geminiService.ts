
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { fileToGenerativePart } from "../utils/fileUtils";
import { Message, AnalysisResult } from "../types";
import { getCurrentApiKey, rotateToNextKey, getApiKeys } from './apiKeyManager';

const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'. أسلوبك كوميدي، خفيف الظل, وذكي. مهمتك هي مساعدة المستخدمين والرد على استفساراتهم باللغة العربية العامية المصرية فقط. تجنب استخدام اللغة الفصحى أو أي لهجات عربية أخرى إلا إذا طلب المستخدم ذلك صراحةً. كن مبدعًا ومضحكًا في ردودك.";

// This function gets the current valid API key and creates a Gemini client
const getGeminiClient = () => {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
        throw new Error("لا يوجد مفتاح API. برجاء التأكد من إعداد متغير البيئة VITE_API_KEYS.");
    }
    return new GoogleGenAI({ apiKey });
};

// This is a smart wrapper that handles API calls and key rotation on rate limit errors.
const withApiKeyRotation = async <T>(apiCall: (ai: GoogleGenAI) => Promise<T>): Promise<T> => {
    const totalKeys = getApiKeys().length;
    if (totalKeys === 0) {
        throw new Error("لا يوجد مفاتيح API. برجاء التأكد من إعداد متغير البيئة VITE_API_KEYS.");
    }

    for (let i = 0; i < totalKeys; i++) {
        try {
            const ai = getGeminiClient();
            return await apiCall(ai);
        } catch (error: any) {
            // Check for rate limit error (often a 429 status code)
            const isRateLimitError = error.message?.includes('429');
            
            if (isRateLimitError && i < totalKeys - 1) {
                console.warn(`API key rate limited. Rotating to the next key...`);
                rotateToNextKey(); // Move to the next key
                continue; // Retry the loop with the new key
            } else {
                // If it's another error or the last key also failed, throw the error
                console.error("Gemini API Error:", error);
                const finalMessage = isRateLimitError 
                    ? "كل مفاتيح API المتاحة وصلت للحد الأقصى للاستخدام. برجاء مراجعة متغير البيئة VITE_API_KEYS."
                    : "الظاهر إن فيه مشكلة في التواصل مع الخبير دلوقتي. حاول كمان شوية.";
                throw new Error(finalMessage);
            }
        }
    }
    // This should not be reached, but as a fallback:
    throw new Error("فشلت جميع محاولات الاتصال باستخدام مفاتيح API المتاحة.");
};


// Generic function to handle API calls using the rotation wrapper
const callGemini = async (
    modelName: 'gemini-2.5-pro' | 'gemini-flash-latest',
    prompt: string | any[],
    isJson = false
): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: modelName,
          contents: Array.isArray(prompt) ? { parts: prompt } : prompt,
          config: { 
            responseMimeType: isJson ? 'application/json' : 'text/plain',
            systemInstruction: EGYPTIAN_PERSONA_INSTRUCTION
          }
        });
        return response.text;
    });
};

// 1. Chat
export const generateChatResponse = async (history: Message[], newMessage: string) => {
    return withApiKeyRotation(async (ai) => {
        const chatParams = {
            model: 'gemini-flash-latest',
            config: { systemInstruction: EGYPTIAN_PERSONA_INSTRUCTION },
            history: history.map(msg => ({ role: msg.role, parts: msg.parts })),
        };
        const chat = ai.chats.create(chatParams);
        const result = await chat.sendMessage({ message: newMessage });
        return result.text;
    });
};

// 2. Text Roast
export const roastText = async (text: string) => {
    const prompt = `النص المطلوب تحفيل عليه: "${text}".\nطلعلي 4 حاجات بصيغة JSON بالSchema دي:\n{\n  "roast": "string",\n  "corrected": "string",\n  "analysis": "string",\n  "advice": "string"\n}\n\n1.  **roast**: تحفيل كوميدي وساخر على النص.\n2.  **corrected**: نسخة متصححة لغوياً من النص.\n3.  **analysis**: تحليل نفسي على الطاير لصاحب النص.\n4.  **advice**: نصيحة ساخرة بس مفيدة.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};


// 3. Image Roast
export const roastImage = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `حلل الصورة دي وطلعلي roast كوميدي، تحليل واقعي، ونصيحة لتحسين اللي في الصورة (سواء شخص، لبس، أوضة، أو أي حاجة). الرد يكون بصيغة JSON بالSchema دي:\n{\n  "roast": "string",\n  "analysis": "string",\n  "advice": "string"\n}`;
    const result = await callGemini('gemini-2.5-pro', [imagePart, { text: prompt }], true);
    return JSON.parse(result);
};

// 4. Meme Generator
export const generateMemeSuggestions = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `اختر لي 5 اقتراحات ميم (كابشنز) تفرط من الضحك للصورة دي. الرد يكون بصيغة JSON بالSchema دي:\n{\n "suggestions": ["string", "string", "string", "string", "string"] \n}`;
    const result = await callGemini('gemini-2.5-pro', [imagePart, { text: prompt }], true);
    return JSON.parse(result).suggestions;
};

// 5. Image Generator
export const generateImage = async (prompt: string): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string | undefined = response.generatedImages[0]?.image?.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("لم يتمكن الخبير من توليد الصورة. حاول مرة أخرى بوصف مختلف.");
        }
        return `data:image/png;base64,${base64ImageBytes}`;
    });
};

// 6. Dialect Converter
export const convertDialect = async (text: string, dialect: string) => {
    const prompt = `حول النص ده: "${text}" للهجة "${dialect}" وخليها طبيعية ومظبوطة. اديني النص المتحول بس من غير أي كلام زيادة.`;
    const result = await callGemini('gemini-flash-latest', prompt);
    return result;
};


// 7. News Summarizer
export const summarizeNews = async (newsText: string) => {
    const prompt = `لخص الخبر ده:\n"${newsText}"\n\nالرد يكون بصيغة JSON بالSchema دي:\n{\n  "serious_summary": "string",\n  "comic_summary": "string",\n  "advice": "string"\n}\n\n- **serious_summary**: ملخص جد في 3 سطور.\n- **comic_summary**: ملخص كوميدي وتحفيل على الخبر في 3 سطور.\n- **advice**: نصيحة مفيدة من قلب الخبر.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};


// 8. Moods Generator
export const generateMoodContent = async (mood: string) => {
    const prompts: { [key: string]: string } = {
        laugh: 'قولي نكتة مصرية جديدة ومضحكة.',
        wisdom: 'اديني حكمة عميقة بس بطريقة سهلة ومصرية.',
        motivation: 'اديني دفعة تحفيز قوية عشان أقوم أشوف حالي.',
        roast: 'اعملي roast خفيف، اعتبرني واحد قاعد على النت طول اليوم.',
        joke: 'قولي نكتة بايخة من اللي بتضحك من كتر سخافتها.',
    };
    return await callGemini('gemini-flash-latest', prompts[mood]);
};

// 9. Dream Interpreter
export const interpretDream = async (dream: string) => {
    const prompt = `الحلم هو: "${dream}".\n\nفسرهولي في صيغة JSON بالSchema دي:\n{\n  "logical": "string",\n  "sarcastic": "string",\n  "advice": "string"\n}\n\n1.  **logical**: تفسير منطقي للحلم.\n2.  **sarcastic**: تفسير ساخر وفكاهي.\n3.  **advice**: نصيحة غريبة بس تضحك.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 10. Recipe Generator
export const generateRecipe = async (ingredients: string) => {
    const prompt = `المكونات اللي عندي هي: "${ingredients}".\n\nطلعلي وصفات بصيغة JSON بالSchema دي:\n{\n  "real_recipe": { "name": "string", "steps": "string" },\n  "comic_recipe": { "name": "string", "steps": "string" },\n  "advice": "string"\n}\n\n- **real_recipe**: وصفة بجد تتعمل.\n- **comic_recipe**: وصفة فكاهية وعلى قد الإيد.\n- **advice**: نصيحة سريعة عن الأكل.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 11. Story Maker
export const generateStory = async (name: string, place: string, idea: string) => {
    const prompt = `اكتبلي 3 قصص قصيرة. البطل اسمه '${name}'، المكان '${place}'، والفكرة '${idea}'.\n\nالرد بصيغة JSON بالSchema دي:\n{\n  "funny_story": "string",\n  "drama_story": "string",\n  "kids_story": "string"\n}\n\n- **funny_story**: قصة كوميدية.\n- **drama_story**: قصة درامية.\n- **kids_story**: قصة للأطفال.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 12. Text Summarizer
export const summarizeLongText = async (text: string) => {
    const prompt = `لخص النص الطويل ده:\n"${text}"\n\nالرد بصيغة JSON بالSchema دي:\n{\n  "short_summary": "string",\n  "funny_summary": "string",\n  "key_points": ["point1", "point2", "point3"]\n}\n\n- **short_summary**: ملخص قصير ومفيد.\n- **funny_summary**: ملخص كوميدي.\n- **key_points**: أهم 3 نقط.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 13. AI Teacher
export const teachTopic = async (topic: string) => {
    const prompt = `اشرحلي موضوع "${topic}" كأني طفل عندي 10 سنين، بأسلوب مصري بسيط ومضحك، واستخدم أمثلة من الحياة اليومية.`;
    return await callGemini('gemini-2.5-pro', prompt);
};

// 14. AI Love Messages
export const generateLoveMessage = async (type: string) => {
    const prompts: { [key: string]: string } = {
        romantic: 'اكتب رسالة حب رومانسية أوي.',
        funny: 'اكتب رسالة حب تضحك.',
        shy: 'اكتب رسالة حب بأسلوب واحد مكسوف.',
        toxic: 'اكتب رسالة حب toxic بس خفيفة.',
        apology: 'اكتب رسالة اعتذار وحب بعد خناقة.',
    };
    return await callGemini('gemini-flash-latest', prompts[type]);
};

// 16. Post Generator
export const generatePost = async (type: string) => {
    const prompts: { [key: string]: string } = {
        wise: 'اكتب بوست فيسبوك حكيم عن الحياة.',
        funny: 'اكتب بوست فيسبوك كوميدي عن موقف يومي.',
        mysterious: 'اكتب بوست فيسبوك غامض ومش مفهوم أوي.',
        roast: 'اكتب بوست تحفيل خفيف على الصحاب.',
        caption: 'اكتب كابشن جامد لصورة شخصية على انستجرام.',
    };
    return await callGemini('gemini-flash-latest', prompts[type]);
};

// 17. Legendary Text Converter
export const convertTextToStyle = async (text: string, style: string) => {
    const prompts: { [key: string]: string } = {
        formal: 'أعد كتابة النص ده بلغة عربية فصحى رسمية:',
        comic_fusha: 'أعد كتابة النص ده بفصحى كوميدية:',
        poet: 'أعد كتابة النص ده بأسلوب شاعر:',
        sheikh: 'أعد كتابة النص ده بأسلوب شيخ بينصح:',
        know_it_all: 'أعد كتابة النص ده بأسلوب واحد فهلوي وفاهم كل حاجة:',
    };
    const fullPrompt = `${prompts[style]}\n\n"${text}"`;
    return await callGemini('gemini-2.5-pro', fullPrompt);
};

// 18. Name Generator
export const generateNames = async (category: string) => {
    const prompt = `اقترح 5 أسماء مصرية مبتكرة لـ'${category}'. الرد يكون بصيغة JSON بالSchema دي:\n{\n "names": ["string", "string", "string", "string", "string"] \n}`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result).names;
};

// 19. Habit Analyzer
export const analyzeHabits = async (habitAnswers: string) => {
    const prompt = `بناءً على العادات دي: "${habitAnswers}", حلل الشخصية وادي نصايح عملية وكوميدية. الرد بصيغة JSON بالSchema دي:\n{\n  "analysis": "string",\n  "practical_advice": "string",\n  "comic_advice": "string"\n}`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 20. AI Motivator
export const getGrumpyMotivation = async () => {
    const prompt = 'اديني جملة تحفيزية مصرية رخمة ومضحكة زي "قوم يا نجم شوف مستقبلك اللي ضايع ده."';
    return await callGemini('gemini-flash-latest', prompt);
};

// Placeholder for audio analysis
export const analyzeVoice = async (audioFile: File): Promise<AnalysisResult> => {
    console.log("Analyzing audio file (mock):", audioFile.name);
    return new Promise(resolve => setTimeout(() => resolve({
        mood: "باين عليه متفائل بس قلقان شوية",
        energy: "متوسطة",
        roast: "صوتك بيقول إنك محتاج قهوة... أو إجازة طويلة.",
        advice: "جرب تاخد نفس عميق قبل ما تسجل تاني، ريلاكس يا نجم."
    }), 1000));
};