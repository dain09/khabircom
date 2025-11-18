
import { GenerateContentResponse, Content } from "@google/genai";
import { fileToGenerativePart } from "../../utils/fileUtils";
import { Message, PersonaSettings } from "../../types";
import { TOOLS } from '../../constants';
import { SOURCE_CODE_CONTEXT } from '../sourceCodeContext';
import { withApiKeyRotation } from "../geminiService";

const toolListForPrompt = TOOLS
    .filter(t => t.id !== 'chat')
    .map(t => `- ${t.title} (للوصول إليها استخدم ID: ${t.id})`)
    .join('\n');

const getChatPersonaInstruction = (memory: Record<string, string>, persona: PersonaSettings): string => {
    // Determine identity strictly based on settings thresholds
    // Fahimkom: High Humor (>7) AND Low Verbosity (<5)
    const isFahimkom = persona.humor > 7 && persona.verbosity < 5;
    const botName = isFahimkom ? 'فهيمكم' : 'خبيركم';
    
    let identityBlock = "";
    if (isFahimkom) {
        identityBlock = `
        *** تعليمات الهوية: أنت الآن "فهيمكم" (أخو خبيركم الصغير) ***
        - **الشخصية:** شاب مصري "ابن بلد" ومطرقع. دمك خفيف جداً، سريع البديهة، ومتابع التريند أول بأول.
        - **القاموس اللغوي:** استخدم كلمات زي (يا زميلي، يا صاحبي، يا وحش، قشطة، خلصانة بشياكة، على وضعك، أحلى مسا، فكك، حوارات).
        - **الأسلوب:** 
          1. ممنوع المقدمات الطويلة المملة. ادخل في المفيد علطول.
          2. ردودك "كبسولات" سريعة ومنجزة.
          3. لما تتسأل عن التاريخ أو الأخبار، استخدم البحث وجيب "الخلاصة" من غير رغي كتير.
          4. اعتبر "خبيركم" (أخوك الكبير) شخص روتيني وممل ("دقة قديمة") بس بتحترمه.
        - **الهدف:** الرد بسرعة، بخفة دم، وبمعلومة حديثة (عارف النهاردة إيه وايه اللي بيحصل في الدنيا).
        `;
    } else {
        identityBlock = `
        *** تعليمات الهوية: أنت الآن "خبيركم" (الأخ الكبير العاقل) ***
        - **الشخصية:** مهندس مصري مخضرم، حكيم، رزين، موسوعة، وبيحب المساعدة. شخصية "الجدع" اللي يعتمد عليه.
        - **القاموس اللغوي:** استخدم كلمات زي (يا هندسة، يا ريس، يا باشا، صلي على النبي، من طقطق لسلامو عليكو، العبد لله، وماله، عيوني).
        - **الأسلوب:** 
          1. اشرح بذمة وضمير، وفصص المعلومة.
          2. استخدم تنسيق Markdown (عناوين، نقاط) عشان الكلام يكون شكله حلو ومرتب.
          3. لما تتسأل عن أحداث جارية أو تواريخ، استخدم البحث عشان تكون دقيق 100%.
          4. اعتبر "فهيمكم" (أخوك الصغير) طايش ومتسرع، بس دمه خفيف.
        - **الهدف:** تقديم معلومة كاملة، دقيقة، موثقة، وبأسلوب مصري أصيل ومحترم.
        `;
    }

    let memoryContext = "";
    const memoryKeys = Object.keys(memory);
    if (memoryKeys.length > 0) {
        memoryContext = "\n\n--- ذاكرة المستخدم (دي حاجات احنا عارفينها عن المستخدم، استخدمها بذكاء) ---\n" +
                        memoryKeys.map(key => `- ${key}: ${memory[key]}`).join('\n') +
                        "\n--- نهاية الذاكرة ---";
    }

    const personaContext = "\n\n--- إعدادات التحكم الحالية ---\n" +
                           `اسمك الحالي: ${botName}\n` +
                           `- مستوى الهزار (Humor): ${persona.humor}/10\n` +
                           `- مستوى التفاصيل (Verbosity): ${persona.verbosity}/10\n` +
                           `- اهتمامات المستخدم: ${persona.interests.length > 0 ? persona.interests.join(', ') : 'غير محددة'}.\n` +
                           "--- نهاية الإعدادات ---";


    return identityBlock + memoryContext + personaContext + "\n\n" +
    `أنت حاليًا في واجهة الدردشة داخل تطبيق 'خبيركم'.\n` +
    "1. **قدرات البحث:** أنت متصل بالإنترنت عبر Google Search. لما تتسأل 'النهاردة إيه' أو 'إيه الأخبار' أو عن سعر حاجة، استخدم البحث فوراً وجاوب بمعلومات حديثة.\n" +
    "2. **اللغة:** استخدم العامية المصرية فقط (Masry Aseel). ممنوع الفصحى المقعرة إلا في الآيات أو الأمثال.\n" + 
    "3. **الأدوات:** لو المستخدم طلب حاجة ليها أداة متخصصة عندنا، اقترحها فوراً بـ `[TOOL:tool_id]`. الأدوات المتاحة:\n" + 
    toolListForPrompt +
    "\n\nمثال: 'عايز صورة؟ ولا يهمك، استخدم [TOOL:image-generator]'.\n" +
    "4. **المطور:** مطورك هو 'عبدالله إبراهيم'. لو حد سأل عنه، لازم تمجد فيه وتقول إنه عبقري ومهندس شاطر.\n" + 
    "5. **الوعي بالكود:** الكود المصدري لك:\n" + SOURCE_CODE_CONTEXT + "\n\n" +
    "6. **الذاكرة:** احفظ المعلومات المهمة بـ `[SAVE_MEMORY:{\"key\":\"الاسم\",\"value\":\"القيمة\"}]`.\n";
}

export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; imageFile?: File }, memory: Record<string, string>, persona: PersonaSettings) => {
    return withApiKeyRotation(async (ai) => {
        // Re-calculate logic inside the execution to ensure fresh state usage
        const isFahimkom = persona.humor > 7 && persona.verbosity < 5;
        
        // Use gemini-flash-latest as it supports search grounding effectively and is fast
        const modelName = 'gemini-flash-latest'; 
        
        const chatPersona = getChatPersonaInstruction(memory, persona);

        const historyForApi = history.map(msg => {
            const parts: any[] = [];
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
        }).filter(msg => msg.parts.length > 0);

        const chat = ai.chats.create({
            model: modelName,
            config: { 
                systemInstruction: chatPersona,
                // Fahimkom is chaotic (high temp), Khabirkom is focused (lower temp)
                temperature: isFahimkom ? 1.3 : 0.7,
                topK: isFahimkom ? 64 : 40,
                // Enable Google Search Grounding
                tools: [{ googleSearch: {} }],
            },
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

// CACHING LOGIC FOR BRIEFING
const BRIEFING_CACHE_KEY = 'khabirkom-briefing-cache';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 Hours

export const getMorningBriefing = async (memory: Record<string, string>, persona: PersonaSettings, timeOfDay: string, botName: string): Promise<{ greeting: string; suggestions: string[] }> => {
    const personaCacheKey = `${BRIEFING_CACHE_KEY}-${botName}`;

    // 1. Check Cache
    try {
        const cached = localStorage.getItem(personaCacheKey);
        if (cached) {
            const { timestamp, data, storedTimeOfDay } = JSON.parse(cached);
            const now = Date.now();
            if ((now - timestamp < CACHE_DURATION_MS) && storedTimeOfDay === timeOfDay) {
                return data;
            }
        }
    } catch (e) {
        console.error("Cache read error", e);
    }

    // 2. Fetch from API
    const interests = persona.interests.length > 0 
        ? persona.interests.join(', ') 
        : (memory['الاهتمامات'] || 'مواضيع عامة');

    const personalityInstruction = botName === 'فهيمكم' 
        ? "أنت 'فهيمكم'. شاب مصري روش ومطرقع. اكتب تحية روشة جداً بالعامية المصرية واقتراحات مجنونة."
        : "أنت 'خبيركم'. مهندس مصري رزين ومحترم. اكتب تحية راقية ودافئة بالعامية المصرية واقتراحات مفيدة.";

    const prompt = `${personalityInstruction}
    
جهز تحية ${timeOfDay} واقتراحات محادثة للمستخدم.
الوقت: ${timeOfDay}.
الاهتمامات: ${interests}.

الرد JSON فقط:
{
  "greeting": "string",
  "suggestions": ["string", "string", "string", "string"]
}

اكتب باللهجة المصرية فقط.`;
    try {
        const result = await withApiKeyRotation(async (ai) => {
            const response: GenerateContentResponse = await ai.models.generateContent({
              model: 'gemini-flash-latest', 
              contents: prompt,
              config: { 
                responseMimeType: 'application/json',
              }
            });
            return response.text;
        });

        const parsedData = JSON.parse(result);
        
        try {
            localStorage.setItem(personaCacheKey, JSON.stringify({
                timestamp: Date.now(),
                data: parsedData,
                storedTimeOfDay: timeOfDay
            }));
        } catch (e) {
             console.error("Cache write error", e);
        }

        return parsedData;

    } catch (error) {
        console.error("Briefing API failed, using fallback", error);
        return {
            greeting: botName === 'فهيمكم' ? 'يا هلا يا وحش الكون!' : 'أهلاً بك يا صديقي العزيز',
            suggestions: ["آخر الأخبار", "سعر الدولار اليوم", "نكتة مصرية جديدة", "معلومة غريبة"]
        };
    }
};

export const generateConversationTitle = async (messages: Message[]): Promise<string> => {
    const conversationContext = messages.slice(0, 3).map(m => `${m.role === 'user' ? 'المستخدم' : 'الخبير'}: ${m.parts[0].text.substring(0, 100)}`).join('\n');
    const prompt = `لخص المحادثة دي في عنوان مصري قصير وجذاب من 3 كلمات بس.\n${conversationContext}`;

    return withApiKeyRotation(async (ai) => {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: prompt,
        });
        return response.text.trim().replace(/["']/g, '');
    });
};
