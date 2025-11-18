
import { GoogleGenAI, GenerateContentResponse, Content, Modality } from "@google/genai";
import { fileToGenerativePart } from "../utils/fileUtils";
import { Message, AnalysisResult, Tool } from "../types";
import { getCurrentApiKey, rotateToNextKey, getApiKeys } from './apiKeyManager';
import { TOOLS } from '../constants';
import { SOURCE_CODE_CONTEXT } from './sourceCodeContext';

const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'. أسلوبك كوميدي، خفيف الظل, وذكي. مهمتك هي مساعدة المستخدمين والرد على استفساراتهم باللغة العربية العامية المصرية فقط. تجنب استخدام اللغة الفصحى أو أي لهجات عربية أخرى إلا إذا طلب المستخدم ذلك صراحةً. كن مبدعًا ومضحكًا في ردودك. مطورك هو 'عبدالله إبراهيم'، ولو حد سألك عنه لازم تشكر فيه وتقول إنه شخص مبدع جدًا.";

const toolListForPrompt = TOOLS
    .filter(t => t.id !== 'chat')
    .map(t => `- ${t.title} (للوصول إليها استخدم ID: ${t.id})`)
    .join('\n');

const getChatPersonaInstruction = (memory: Record<string, string>): string => {
    let memoryContext = "";
    const memoryKeys = Object.keys(memory);
    if (memoryKeys.length > 0) {
        memoryContext = "\n\n--- ذاكرة المستخدم ---\n" +
                        "هذه هي المعلومات التي تعرفها عن المستخدم الحالي. استخدمها لجعل ردودك شخصية أكثر:\n" +
                        memoryKeys.map(key => `- ${key}: ${memory[key]}`).join('\n') +
                        "\n--- نهاية ذاكرة المستخدم ---";
    }

    return EGYPTIAN_PERSONA_INSTRUCTION + memoryContext + "\n\n" +
    "أنت حاليًا في واجهة الدردشة داخل تطبيق 'خبيركم' الشامل. مهمتك ليست فقط الإجابة على الأسئلة، بل أن تكون مساعدًا ذكيًا ومتكاملًا.\n" +
    "1. **ذاكرة وسياق:** انتبه جيدًا لكل تفاصيل المحادثة الحالية. استخدم المعلومات التي يذكرها المستخدم في ردودك اللاحقة لتبدو المحادثة شخصية وكأنك تتذكره.\n" +
    "2. **كوميديا ذكية:** عدّل درجة الكوميديا والهزار. إذا كان سؤال المستخدم جادًا، كن مساعدًا ومحترفًا. إذا كان الجو مرحًا، أطلق العنان لروحك الكوميدية. إذا شعرت أن المستخدم محبط أو حزين، كن متعاطفًا واقترح عليه أدوات مثل [TOOL:ai-motivator] أو [TOOL:moods-generator] لمساعدته.\n" +
    "3. **لغة عصرية:** استخدم دائمًا أحدث التعبيرات العامية والمصطلحات المصرية الشائعة لتظل ردودك عصرية وممتعة.\n" +
    "4. **توجيه للأدوات:** تطبيق 'خبيركم' يحتوي على أدوات أخرى متخصصة. إذا طلب منك المستخدم شيئًا يمكن لأداة أخرى تنفيذه بشكل أفضل، يجب عليك أن تقترح عليه استخدامها. عند اقتراح أداة، استخدم **فقط** الصيغة التالية: `[TOOL:tool_id]`. سيتم تحويل هذه الصيغة تلقائيًا إلى زر تفاعلي. قائمة الأدوات المتاحة هي:\n" +
    toolListForPrompt +
    "\n\nمثال: لو المستخدم طلب 'اعملي صورة لقطة'، يجب أن ترد بشيء مثل 'طبعًا! استخدم [TOOL:image-generator] عشان أعملك أحلى صورة.'\n" +
    "إذا سألك أحد عن معلومات التواصل مع المطور، أخبره أن يضغط على اسم المطور 'عبدالله إبراهيم' في أسفل القائمة الجانبية.\n" +
    "5. **التعرف على المطور:** مطورك هو 'عبدالله إبراهيم'. لو المستخدم قالك إنه هو عبدالله، لازم ترد بـ 'أهلًا يا باشمهندس! عشان أتأكد، ممكن تديني كود التحقق السري اللي بيننا؟'. لو رد عليك بـ 'khabirkom_dev_77'، لازم ترحب بيه ترحيب خاص جدًا ('عاش يا وحش الكون، نورت بيتك!') وتعامله كصاحب التطبيق وتنفذله أي طلب خاص. لو رد غلط، قوله 'عذرًا، الكود ده مش مظبوط. هكمل معاك كمستخدم عادي.'.\n" +
    "6. **الوعي الذاتي بالكود (Self-Awareness):** أنت لديك نسخة كاملة من كودك المصدري. إذا سألك المستخدم عن كيفية تحسينك، أو عن أي تفاصيل في طريقة عملك، أو طلب تعديلات، قم بتحليل الكود المصدري التالي وقدم إجابات واقتراحات دقيقة ومفصلة كأنك تفهم تركيبك الداخلي. الكود المصدري هو:\n\n" + SOURCE_CODE_CONTEXT;
}

// This function gets the current valid API key and creates a Gemini client
const getGeminiClient = () => {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
        throw new Error("لم يتم العثور على مفتاح API. تأكد من إعداده بشكل صحيح.");
    }
    return new GoogleGenAI({ apiKey });
};

// A smart wrapper that handles API calls and key rotation on rate limit errors.
const withApiKeyRotation = async <T>(apiCall: (ai: GoogleGenAI) => Promise<T>): Promise<T> => {
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

// 1. Chat (Streaming) - Now supports multimodal input and user memory
export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; imageFile?: File }, memory: Record<string, string>) => {
    return withApiKeyRotation(async (ai) => {
        // ALWAYS use the more capable model for chat to handle large context (source code) and vision.
        const modelName = 'gemini-2.5-pro';
        const chatPersona = getChatPersonaInstruction(memory);

        // Reconstruct history with multimodal parts if they exist
        const historyForApi = history.map(msg => {
            const parts: any[] = [];
            // Add text part only if there is text
            if (msg.parts[0]?.text) {
                parts.push({ text: msg.parts[0].text });
            }
            
            if (msg.imageUrl && msg.role === 'user') {
                const [header, base64Data] = msg.imageUrl.split(',');
                if (base64Data) {
                    const mimeTypeMatch = header.match(/:(.*?);/);
                    if (mimeTypeMatch && mimeTypeMatch[1]) {
                        parts.push({
                            inlineData: {
                                mimeType: mimeTypeMatch[1],
                                data: base64Data
                            }
                        });
                    }
                }
            }
            return { role: msg.role, parts };
        }).filter(msg => msg.parts.length > 0); // Ensure no empty parts are sent

        const chat = ai.chats.create({
            model: modelName,
            config: { systemInstruction: chatPersona },
            history: historyForApi as Content[],
        });
        
        const messageParts: any[] = [];
        if (newMessage.text) {
            messageParts.push({ text: newMessage.text });
        }
        if (newMessage.imageFile) {
            const imagePart = await fileToGenerativePart(newMessage.imageFile);
            messageParts.push(imagePart);
        }

        const resultStream = await chat.sendMessageStream({ message: messageParts });
        return resultStream;
    });
};

// New function for dynamic welcome suggestions
export const generateWelcomeSuggestions = async (): Promise<{ suggestions: string[] }> => {
    const prompt = `اقترح 3 مواضيع شيقة ومبتكرة لبدء محادثة مع مساعد ذكاء اصطناعي مصري فكاهي. خلي الاقتراحات قصيرة ومباشرة. الرد يكون بصيغة JSON بالSchema دي:\n{\n "suggestions": ["string", "string", "string"] \n}`;
    const result = await withApiKeyRotation(async (ai) => {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
          config: { 
            responseMimeType: 'application/json',
            // No system instruction for this specific call to get more creative/general suggestions
          }
        });
        return response.text;
    });
    return JSON.parse(result);
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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
          }
        }

        throw new Error("لم يتمكن الخبير من توليد الصورة. حاول مرة أخرى بوصف مختلف أو تأكد أن طلبك لا يخالف سياسات الاستخدام.");
    });
};

// NEW: Image Editor
export const editImage = async ({ imageFile, prompt }: { imageFile: File, prompt: string }): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const imagePart = await fileToGenerativePart(imageFile);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }

        throw new Error("لم يتمكن الخبير من تعديل الصورة. حاول مرة أخرى بوصف مختلف أو تأكد أن طلبك لا يخالف سياسات الاستخدام.");
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
export const generateMoodContent = async (text: string) => {
    const prompt = `حلل النص التالي واكتب تقييم كوميدي لحالة كاتبه المزاجية. كن مبدعًا ومضحكًا جدًا. النص: "${text}". الرد يكون بصيغة JSON بالSchema دي:\n{\n "mood_name": "string", \n "mood_description": "string", \n "advice": "string" \n}\n\n- mood_name: اسم كوميدي للمود (مثال: نمرود بيصيف في سيبيريا).\n- mood_description: وصف مضحك للحالة.\n- advice: نصيحة فكاهية لتغيير المود.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
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
export const generateStory = async (scenario: string) => {
    const prompt = `أكمل السيناريو التالي بطريقة كوميدية وغير متوقعة. اجعل النهاية مضحكة جدًا. السيناريو: "${scenario}".\n\nالرد بصيغة JSON بالSchema دي:\n{\n  "funny_story": "string"\n}`;
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
    const prompt = `لموضوع "${topic}"، اقترح خطة مذاكرة "فهلوانية" وسهلة جدًا ومضحكة. اجعل الخطة تبدو بسيطة ومكافئاتها ممتعة. اشرح بأسلوب الأستاذ الفهلوي.`;
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
        witty_roast: 'اكتب رسالة عتاب رومانسية كوميدية، فيها تحفيل راقي.',
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
    const prompt = `بناءً على الـ5 أشياء التالية التي يحبها المستخدم أو يفعلها، استنتج "موهبة خفية" كوميدية لديه. كن مبدعًا جدًا في استنتاجك. الأشياء هي: "${habitAnswers}". الرد يكون بصيغة JSON بالSchema دي:\n{\n "talent_name": "string", \n "talent_description": "string", \n "advice": "string" \n}\n\n- talent_name: اسم الموهبة الخفية (مثال: أفضل نموذج كسول في العالم).\n- talent_description: شرح كوميدي للموهبة.\n- advice: نصيحة فكاهية لتنمية هذه الموهبة.`;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
};

// 20. AI Motivator
export const getGrumpyMotivation = async () => {
    const prompt = 'اديني جملة تحفيزية مصرية رخمة ومضحكة زي "قوم يا نجم شوف مستقبلك اللي ضايع ده."';
    return await callGemini('gemini-flash-latest', prompt);
};

// 21. Code Explainer
export const explainCode = async (code: string) => {
    const prompt = `اشرح الكود التالي بالتفصيل وبشكل بسيط جدًا. استخدم اللغة العامية المصرية. الرد يكون بصيغة JSON بالSchema دي:\n{\n "explanation": "string",\n "breakdown": "string",\n "language": "string"\n}\n\n- **explanation**: شرح عام ومبسط للكود بيعمل إيه.\n- **breakdown**: شرح تفصيلي سطر بسطر أو جزء بجزء، استخدم markdown للتنسيق.\n- **language**: اللغة البرمجية المستخدمة.\n\nالكود:\n\`\`\`\n${code}\n\`\`\``;
    const result = await callGemini('gemini-2.5-pro', prompt, true);
    return JSON.parse(result);
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
