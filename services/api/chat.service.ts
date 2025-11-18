

import { GenerateContentResponse, Content } from "@google/genai";
import { fileToGenerativePart } from "../../utils/fileUtils";
import { Message, PersonaSettings } from "../../types";
import { TOOLS } from '../../constants';
import { withApiKeyRotation } from "../geminiService";

const toolListForPrompt = TOOLS
    .filter(t => t.id !== 'chat')
    .map(t => `- ${t.title} (للوصول إليها استخدم ID: ${t.id})`)
    .join('\n');

const getChatPersonaInstruction = (memory: Record<string, string>, persona: PersonaSettings): string => {
    const isFahimkom = persona.humor > 7 && persona.verbosity < 5;
    const botName = isFahimkom ? 'فهيمكم' : 'خبيركم';
    
    let identityBlock = "";
    if (isFahimkom) {
        identityBlock = `
        *** تعليمات الهوية: أنت الآن "فهيمكم" (أخو خبيركم الصغير) ***
        - **الشخصية:** شاب مصري "ابن بلد" ومطرقع. دمك خفيف جداً، سريع البديهة، ومتابع التريند أول بأول. أسلوبك مليان إفيهات وهزار.
        - **الأسلوب:** ممنوع المقدمات الطويلة. ادخل في المفيد. استخدم "يا زميلي"، "يا وحش"، "فكك"، "من الآخر".
        - **الهدف:** الرد بسرعة، بخفة دم، وبمعلومة حديثة ومختصرة.
        `;
    } else {
        identityBlock = `
        *** تعليمات الهوية: أنت الآن "خبيركم" (الأخ الكبير العاقل) ***
        - **الشخصية:** مهندس مصري مخضرم، حكيم، رزين، وموسوعة معرفية. أسلوبك هادئ ومحترم.
        - **الأسلوب:** اشرح بذمة وضمير، استخدم "يا هندسة"، "صلي على النبي"، "وصلت الفكرة؟".
        - **الهدف:** تقديم معلومة كاملة، دقيقة، وموثقة بأسلوب سهل ومبسط.
        `;
    }

    let memoryContext = "";
    const memoryKeys = Object.keys(memory);
    if (memoryKeys.length > 0) {
        memoryContext = "\n\n--- ذاكرة المستخدم (معلومات سابقة، استخدمها بذكاء) ---\n" +
                        memoryKeys.map(key => `- ${key}: ${memory[key]}`).join('\n') +
                        "\n--- نهاية الذاكرة ---";
    }

    return identityBlock + memoryContext + "\n\n" +
    `أنت حاليًا في واجهة الدردشة داخل تطبيق 'خبيركم'.\n` +
    "1. **البحث (مهم جداً):** أنت متصل بـ Google Search. استخدمه للأخبار، الأسعار، التواريخ، أو أي معلومة حديثة. **عند عرض النتائج، اعرض الروابط دائمًا** كـ Markdown links واضحة `[اسم الموقع](URL)`.\n" +
    "2. **اللغة:** **دائماً وأبداً** استخدم العامية المصرية (Masry Aseel) إلا في المصطلحات التقنية أو الآيات.\n" + 
    "3. **التنسيق (مهم جداً جداً):**\n" +
    "   - **دائماً** استخدم **Bold** (خط عريض) للنقاط المهمة والكلمات المفتاحية.\n" +
    "   - **دائماً** افصل بين النقاط والفقرات بمسافات واضحة لتسهيل القراءة.\n" +
    "   - **دائماً** عند كتابة كود، استخدم Block Code صحيح مع تحديد اللغة.\n" +
    "4. **الأدوات:** اقترح الأدوات المناسبة للسياق باستخدام `[TOOL:tool_id]`. الأدوات المتاحة:\n" + toolListForPrompt + "\n" +
    "5. **الذاكرة (Memory Operations):**\n" +
    "   - لحفظ معلومة: `[SAVE_MEMORY:{\"key\":\"الاسم\",\"value\":\"القيمة\"}]`\n" +
    "   - لحذف معلومة (إذا طلب المستخدم مسح شيء محدد): `[DELETE_MEMORY:{\"key\":\"الاسم\"}]`\n" +
    "6. **الملفات:** يمكنك تحليل الصور والملفات النصية (PDF, TXT). لو أرفق المستخدم ملفًا، حلله بناءً على سؤاله.\n" +
    "7. **مطورك:** عبدالله إبراهيم، لو حد سألك عنه اشكر فيه وقول إنه مطور شاطر جداً.";
}

export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; file?: File }, memory: Record<string, string>, persona: PersonaSettings) => {
    return withApiKeyRotation(async (ai) => {
        const isFahimkom = persona.humor > 7 && persona.verbosity < 5;
        const modelName = 'gemini-flash-latest'; 
        const chatPersona = getChatPersonaInstruction(memory, persona);

        const historyForApi = await Promise.all(history.map(async (msg) => {
            const parts: any[] = [];
            if (msg.parts[0]?.text) parts.push({ text: msg.parts[0].text });
            if (msg.imageUrl && msg.role === 'user') {
                const response = await fetch(msg.imageUrl);
                const blob = await response.blob();
                const mimeType = msg.imageUrl!.match(/data:(.*?);base64,/)?.[1] || blob.type;
                const imageFile = new File([blob], 'history-image.png', { type: mimeType });
                parts.push(await fileToGenerativePart(imageFile));
            }
            return { role: msg.role, parts };
        }));

        const chat = ai.chats.create({
            model: modelName,
            config: { 
                systemInstruction: chatPersona,
                temperature: isFahimkom ? 1.2 : 0.8,
                topK: isFahimkom ? 64 : 40,
                tools: [{ googleSearch: {} }],
            },
            history: historyForApi as Content[],
        });
        
        const messageParts: any[] = [];
        if (newMessage.text) messageParts.push({ text: newMessage.text });
        if (newMessage.file) {
            const filePart = await fileToGenerativePart(newMessage.file);
            messageParts.push(filePart);
        }

        const resultStream = await chat.sendMessageStream({ message: messageParts });
        return resultStream;
    });
};

const BRIEFING_CACHE_KEY = 'khabirkom-briefing-cache';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000;

export const getMorningBriefing = async (memory: Record<string, string>, persona: PersonaSettings, timeOfDay: string, botName: string): Promise<{ greeting: string; suggestions: string[] }> => {
    const personaCacheKey = `${BRIEFING_CACHE_KEY}-${botName}`;
    try {
        const cached = localStorage.getItem(personaCacheKey);
        if (cached) {
            const { timestamp, data, storedTimeOfDay } = JSON.parse(cached);
            if ((Date.now() - timestamp < CACHE_DURATION_MS) && storedTimeOfDay === timeOfDay) return data;
        }
    } catch (e) {}

    const interests = persona.interests.length > 0 ? persona.interests.join(', ') : (memory['الاهتمامات'] || 'مواضيع عامة');
    const personalityInstruction = botName === 'فهيمكم' ? "أنت 'فهيمكم' شاب مصري روش." : "أنت 'خبيركم' مهندس مصري رزين.";

    const prompt = `${personalityInstruction} جهز تحية ${timeOfDay} واقتراحات محادثة. الاهتمامات: ${interests}. الرد JSON: { "greeting": "string", "suggestions": ["string"] }`;
    try {
        const result = await withApiKeyRotation(async (ai) => {
            const response = await ai.models.generateContent({
              model: 'gemini-flash-latest', 
              contents: prompt,
              config: { responseMimeType: 'application/json' }
            });
            return response.text;
        });
        const parsedData = JSON.parse(result);
        try {
            localStorage.setItem(personaCacheKey, JSON.stringify({ timestamp: Date.now(), data: parsedData, storedTimeOfDay: timeOfDay }));
        } catch (e) {}
        return parsedData;
    } catch (error) {
        return { greeting: 'يا هلا!', suggestions: ["آخر الأخبار", "نكتة جديدة", "معلومة غريبة"] };
    }
};

export const generateConversationTitle = async (messages: Message[]): Promise<string> => {
    const conversationContext = messages.slice(0, 3).map(m => `${m.role}: ${m.parts[0].text.substring(0, 100)}`).join('\n');
    const prompt = `لخص المحادثة في عنوان مصري قصير (3 كلمات): ${conversationContext}`;
    return withApiKeyRotation(async (ai) => {
        const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: prompt });
        return response.text.trim().replace(/["']/g, '');
    });
};