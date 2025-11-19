import { GenerateContentResponse } from "@google/genai";
import { withApiKeyRotation, EGYPTIAN_PERSONA_INSTRUCTION } from "../geminiService";
import { AnalysisResult } from "../../types";

const callGemini = async (
    modelName: 'gemini-3-pro-preview' | 'gemini-flash-latest',
    prompt: string,
    isJson = false,
    useGrounding = false
): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { 
            responseMimeType: isJson ? 'application/json' : 'text/plain',
            systemInstruction: EGYPTIAN_PERSONA_INSTRUCTION,
            tools: useGrounding ? [{ googleSearch: {} }] : undefined
          }
        });
        return response.text;
    });
};

export const roastText = async (text: string) => {
    const prompt = `النص المطلوب تحفيل عليه: "${text}".\nطلعلي 4 حاجات بصيغة JSON بالSchema دي:\n{\n  "roast": "string",\n  "corrected": "string",\n  "analysis": "string",\n  "advice": "string"\n}\n\n1.  **roast**: تحفيل كوميدي وساخر على النص.\n2.  **corrected**: نسخة متصححة لغوياً من النص.\n3.  **analysis**: تحليل نفسي على الطاير لصاحب النص.\n4.  **advice**: نصيحة ساخرة بس مفيدة.`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const convertDialect = async (text: string, dialect: string) => {
    const prompt = `حول النص ده: "${text}" للهجة "${dialect}" وخليها طبيعية ومظبوطة. اديني النص المتحول بس من غير أي كلام زيادة.`;
    const result = await callGemini('gemini-flash-latest', prompt);
    return result;
};

export const summarizeNews = async (newsText: string) => {
    const prompt = `لخص الخبر ده:\n"${newsText}"\n\nالرد يكون بصيغة JSON بالSchema دي:\n{\n  "serious_summary": "string",\n  "comic_summary": "string",\n  "advice": "string"\n}\n\n- **serious_summary**: ملخص جد في 3 سطور.\n- **comic_summary**: ملخص كوميدي وتحفيل على الخبر في 3 سطور.\n- **advice**: نصيحة مفيدة من قلب الخبر.`;
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const generateMoodContent = async (text: string) => {
    const prompt = `حلل النص التالي واكتب تقييم كوميدي لحالة كاتبه المزاجية. كن مبدعًا ومضحكًا جدًا. النص: "${text}". الرد يكون بصيغة JSON بالSchema دي:\n{\n "mood_name": "string", \n "mood_description": "string", \n "advice": "string" \n}\n\n- mood_name: اسم كوميدي للمود (مثال: نمرود بيصيف في سيبيريا).\n- mood_description: وصف مضحك للحالة.\n- advice: نصيحة فكاهية لتغيير المود.`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const interpretDream = async (dream: string) => {
    const prompt = `الحلم هو: "${dream}".\n\nفسرهولي في صيغة JSON بالSchema دي:\n{\n  "logical": "string",\n  "sarcastic": "string",\n  "advice": "string"\n}\n\n1.  **logical**: تفسير منطقي للحلم.\n2.  **sarcastic**: تفسير ساخر وفكاهي.\n3.  **advice**: نصيحة غريبة بس تضحك.`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const generateRecipe = async (ingredients: string) => {
    const prompt = `المكونات اللي عندي هي: "${ingredients}".\n\nطلعلي وصفات بصيغة JSON بالSchema دي:\n{\n  "real_recipe": { "name": "string", "steps": "string" },\n  "comic_recipe": { "name": "string", "steps": "string" },\n  "advice": "string"\n}\n\n- **real_recipe**: وصفة بجد تتعمل.\n- **comic_recipe**: وصفة فكاهية وعلى قد الإيد.\n- **advice**: نصيحة سريعة عن الأكل.`;
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const generateStory = async (scenario: string) => {
    const prompt = `أكمل السيناريو التالي بطريقة كوميدية وغير متوقعة. اجعل النهاية مضحكة جدًا. السيناريو: "${scenario}".\n\nالرد بصيغة JSON بالSchema دي:\n{\n  "funny_story": "string"\n}`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const summarizeLongText = async (text: string) => {
    const prompt = `لخص النص الطويل ده:\n"${text}"\n\nالرد بصيغة JSON بالSchema دي:\n{\n  "short_summary": "string",\n  "funny_summary": "string",\n  "key_points": ["point1", "point2", "point3"]\n}\n\n- **short_summary**: ملخص قصير ومفيد.\n- **funny_summary**: ملخص كوميدي.\n- **key_points**: أهم 3 نقط.`;
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const teachTopic = async (topic: string) => {
    const prompt = `لموضوع "${topic}"، اقترح خطة مذاكرة "فهلوانية" وسهلة جدًا ومضحكة. اجعل الخطة تبدو بسيطة ومكافئاتها ممتعة. اشرح بأسلوب الأستاذ الفهلوي.`;
    return await callGemini('gemini-3-pro-preview', prompt);
};

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

export const convertTextToStyle = async (text: string, style: string) => {
    const prompts: { [key: string]: string } = {
        formal: 'أعد كتابة النص ده بلغة عربية فصحى رسمية:',
        comic_fusha: 'أعد كتابة النص ده بفصحى كوميدية:',
        poet: 'أعد كتابة النص ده بأسلوب شاعر:',
        sheikh: 'أعد كتابة النص ده بأسلوب شيخ بينصح:',
        know_it_all: 'أعد كتابة النص ده بأسلوب واحد فهلوي وفاهم كل حاجة:',
    };
    const fullPrompt = `${prompts[style]}\n\n"${text}"`;
    return await callGemini('gemini-3-pro-preview', fullPrompt);
};

export const generateNames = async (category: string) => {
    const prompt = `اقترح 5 أسماء مصرية مبتكرة لـ'${category}'. الرد يكون بصيغة JSON بالSchema دي:\n{\n "names": ["string", "string", "string", "string", "string"] \n}`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result).names;
};

export const analyzeHabits = async (habitAnswers: string) => {
    const prompt = `بناءً على الـ5 أشياء التالية التي يحبها المستخدم أو يفعلها، استنتج "موهبة خفية" كوميدية لديه. كن مبدعًا جدًا في استنتاجك. الأشياء هي: "${habitAnswers}". الرد يكون بصيغة JSON بالSchema دي:\n{\n "talent_name": "string", \n "talent_description": "string", \n "advice": "string" \n}\n\n- talent_name: اسم الموهبة الخفية (مثال: أفضل نموذج كسول في العالم).\n- talent_description: شرح كوميدي للموهبة.\n- advice: نصيحة فكاهية لتنمية هذه الموهبة.`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const getGrumpyMotivation = async () => {
    const prompt = 'اديني جملة تحفيزية مصرية رخمة ومضحكة زي "قوم يا نجم شوف مستقبلك اللي ضايع ده."';
    return await callGemini('gemini-flash-latest', prompt);
};

export const explainCode = async (code: string) => {
    const prompt = `اشرح الكود التالي بالتفصيل وبشكل بسيط جدًا. استخدم اللغة العامية المصرية. الرد يكون بصيغة JSON بالSchema دي:\n{\n "explanation": "string",\n "breakdown": "string",\n "language": "string"\n}\n\n- **explanation**: شرح عام ومبسط للكود بيعمل إيه.\n- **breakdown**: شرح تفصيلي سطر بسطر أو جزء بجزء، استخدم markdown للتنسيق.\n- **language**: اللغة البرمجية المستخدمة.\n\nالكود:\n\`\`\`\n${code}\n\`\`\``;
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const organizeTasks = async (input: string) => {
    const prompt = `رتب المهام دي في جدول أولويات منطقي. المهام هي: "${input}".
    الرد JSON Schema:
    {
      "tasks": [
        { "task": "string", "priority": "High/Medium/Low", "estimated_time": "string", "category": "string" }
      ],
      "summary_advice": "string"
    }`;
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const comparePrices = async (product: string) => {
    const prompt = `ابحث عن سعر "${product}" في المتاجر المصرية (أمازون مصر، نون، بي تك، إلخ) وقارن الأسعار.
    اعمل جدول markdown بالأسعار والمتاجر، وتحته "الخلاصة" عن أفضل مكان للشراء حالياً. خليك دقيق واستخدم أحدث بيانات متاحة.`;
    // We use gemini-flash-latest with grounding enabled (passed as true)
    return await callGemini('gemini-flash-latest', prompt, false, true);
};

export const analyzeVoice = async (audioFile: File): Promise<AnalysisResult> => {
    console.log("Analyzing audio file (mock):", audioFile.name);
    return new Promise(resolve => setTimeout(() => resolve({
        mood: "باين عليه متفائل بس قلقان شوية",
        energy: "متوسطة",
        roast: "صوتك بيقول إنك محتاج قهوة... أو إجازة طويلة.",
        advice: "جرب تاخد نفس عميق قبل ما تسجل تاني، ريلاكس يا نجم."
    }), 1000));
};