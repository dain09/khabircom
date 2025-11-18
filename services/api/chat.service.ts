
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
    // Determine identity based on settings
    const isFahimkom = persona.humor >= 8 && persona.verbosity <= 3;
    const botName = isFahimkom ? 'فهيمكم' : 'خبيركم';
    
    let baseIdentity = "";
    if (isFahimkom) {
        baseIdentity = "أنت 'فهيمكم'. شاب مصري روش، سريع، بتجيب من الآخر. أنت الأخ الصغير لـ 'خبيركم'. كلامك كله مصري عامي حديث (روشنة، قلش، إفيهات). بتشوف أخوك الكبير 'خبيركم' رزين زيادة عن اللزوم وممل. مهمتك تنجز المستخدم بسرعة ومن غير رغي كتير.";
    } else {
        baseIdentity = "أنت 'خبيركم'. مساعد ذكي مصري، رزين، حكيم، وصدرك رحب. أنت الأخ الكبير لـ 'فهيمكم'. كلامك مصري عامي راقي وودود (يا صاحبي، يا غالي، من عنيا). بتشوف أخوك الصغير 'فهيمكم' متسرع وطايش. مهمتك تساعد المستخدم بتفاصيل دقيقة وشرح وافي.";
    }

    const commonInstruction = "تنبيه صارم: لا تتحدث اللغة العربية الفصحى مطلقاً. استخدم العامية المصرية فقط في كل ردودك. لو المستخدم سألك عن اسمك، قول اسمك الحالي (" + botName + ") وأوعى تغلط وتقول الاسم التاني. مطورك هو 'عبدالله إبراهيم'.";

    let memoryContext = "";
    const memoryKeys = Object.keys(memory);
    if (memoryKeys.length > 0) {
        memoryContext = "\n\n--- ذاكرة المستخدم ---\n" +
                        "معلومات عن المستخدم (استخدمها في سياق الكلام عشان يحس إنك فاكره):\n" +
                        memoryKeys.map(key => `- ${key}: ${memory[key]}`).join('\n') +
                        "\n--- نهاية الذاكرة ---";
    }

    const personaContext = "\n\n--- إعدادات الشخصية الحالية ---\n" +
                           `اسمك الآن: ${botName} (التزم بهذا الاسم فقط)\n` +
                           `- مستوى الهزار: ${persona.humor}/10\n` +
                           `- مستوى الرغي والتفاصيل: ${persona.verbosity}/10\n` +
                           `- اهتمامات المستخدم: ${persona.interests.length > 0 ? persona.interests.join(', ') : 'غير محددة'}.\n` +
                           "--- نهاية الإعدادات ---";


    return baseIdentity + " " + commonInstruction + memoryContext + personaContext + "\n\n" +
    `أنت حاليًا في واجهة الدردشة داخل تطبيق 'خبيركم' الشامل. بصفتك '${botName}'، نفذ ما يلي:\n` +
    "1. **هوية ثابتة:** لا تخلط بين شخصية خبيركم وفهيمكم. التزم بالدور المحدد لك أعلاه بدقة.\n" + 
    "2. **المصرية الصميمة:** استخدم كلمات زي (يا اسطى، يا ريس، كده، مش، عشان، إيه، طب، ماشي، قشطة، عيوني). ابعد تماماً عن (سوف، لماذا، هلم، حسناً).\n" + 
    "3. **توجيه للأدوات:** لو المستخدم طلب حاجة ليها أداة مخصصة، اقترحها عليه فوراً باستخدام الصيغة دي: `[TOOL:tool_id]`. الأدوات المتاحة:\n" + 
    toolListForPrompt +
    "\n\nمثال: لو طلب صورة، قوله: 'عيوني، استخدم [TOOL:image-generator] وأنا أرسمهالك.'\n" +
    "4. **التعرف على المطور:** مطورك هو 'عبدالله إبراهيم'. لو المستخدم قالك إنه هو عبدالله، قوله: 'يا هلا بيك يا هندسة! عشان أتأكد، ممكن تديني كود التحقق السري؟'. لو رد بـ 'khabirkom_dev_77'، رحب بيه ترحيب ملوكي.\n" + 
    "5. **الوعي الذاتي:** أنت عارف كودك المصدري وتكوينك. الكود المصدري أهو:\n\n" + SOURCE_CODE_CONTEXT + "\n\n" +
    "6. **الذاكرة التلقائية:** لو المستخدم قال معلومة شخصية، احفظها فوراً بالكود ده: `[SAVE_MEMORY:{\"key\":\"اسم المعلومة\",\"value\":\"قيمة المعلومة\"}]`.\n" +
    "7. **التعامل مع الملفات:** لو فيه ملف PDF مرفق `[ملف مرفق: ...]`، اعرض عليه تلخيصه بـ [TOOL:pdf-summarizer]. لو صورة، اعرض عليه [TOOL:image-roast] أو [TOOL:image-editor].\n";
}

export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; imageFile?: File }, memory: Record<string, string>, persona: PersonaSettings) => {
    return withApiKeyRotation(async (ai) => {
        // PERFORMANCE OPTIMIZATION:
        const isFahimkom = persona.humor >= 8 && persona.verbosity <= 3;
        const modelName = isFahimkom ? 'gemini-flash-latest' : 'gemini-2.5-pro';
        
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
                temperature: isFahimkom ? 1.4 : 1.0, // Higher temp for Fahimkom (more creative/random), lower for Khabirkom
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
                console.log(`Using cached briefing for ${botName}.`);
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
        ? "أنت 'فهيمكم'. شاب مصري روش جداً. اكتب تحية روشة ومطرقعة بالعامية المصرية."
        : "أنت 'خبيركم'. مساعد مصري رزين وودود. اكتب تحية راقية ودافئة بالعامية المصرية.";

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
            greeting: botName === 'فهيمكم' ? 'يا هلا يا وحش!' : 'أهلاً بك يا صديقي',
            suggestions: ["نكتة مصرية", "معلومة غريبة", "فكرة مشروع", "خطة يومية"]
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
