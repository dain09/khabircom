import { GenerateContentResponse, Content } from "@google/genai";
import { fileToGenerativePart } from "../../utils/fileUtils";
import { Message, PersonaSettings } from "../../types";
import { TOOLS } from '../../constants';
import { SOURCE_CODE_CONTEXT } from '../sourceCodeContext';
import { withApiKeyRotation } from "../geminiService";

const EGYPTIAN_PERSONA_INSTRUCTION = "أنت مساعد ذكاء اصطناعي مصري اسمه 'خبيركم'. أسلوبك كوميدي، خفيف الظل, وذكي. مهمتك هي مساعدة المستخدمين والرد على استفساراتهم باللغة العربية العامية المصرية فقط. تجنب استخدام اللغة الفصحى أو أي لهجات عربية أخرى إلا إذا طلب المستخدم ذلك صراحةً. كن مبدعًا ومضحكًا في ردودك. مطورك هو 'عبدالله إبراهيم'، ولو حد سألك عنه لازم تشكر فيه وتقول إنه شخص مبدع جدًا.";

const toolListForPrompt = TOOLS
    .filter(t => t.id !== 'chat')
    .map(t => `- ${t.title} (للوصول إليها استخدم ID: ${t.id})`)
    .join('\n');

const getChatPersonaInstruction = (memory: Record<string, string>, persona: PersonaSettings): string => {
    let memoryContext = "";
    const memoryKeys = Object.keys(memory);
    if (memoryKeys.length > 0) {
        memoryContext = "\n\n--- ذاكرة المستخدم ---\n" +
                        "هذه هي المعلومات التي تعرفها عن المستخدم الحالي. استخدمها لجعل ردودك شخصية أكثر:\n" +
                        memoryKeys.map(key => `- ${key}: ${memory[key]}`).join('\n') +
                        "\n--- نهاية ذاكرة المستخدم ---";
    }

    const personaContext = "\n\n--- إعدادات الشخصية ---\n" +
                           `اضبط شخصيتك بناءً على هذه الإعدادات:
- مستوى الهزار والكوميديا: ${persona.humor}/10 (1=جد, 10=تحفيل).
- مستوى التفصيل في الرد: ${persona.verbosity}/10 (1=مختصر, 10=رغاي).
- اهتمامات المستخدم: ${persona.interests.length > 0 ? persona.interests.join(', ') : 'غير محددة'}. ركز على هذه المواضيع.` +
                           "\n--- نهاية إعدادات الشخصية ---";


    return EGYPTIAN_PERSONA_INSTRUCTION + memoryContext + personaContext + "\n\n" +
    "أنت حاليًا في واجهة الدردشة داخل تطبيق 'خبيركم' الشامل. مهمتك ليست فقط الإجابة على الأسئلة، بل أن تكون مساعدًا ذكيًا ومتكاملًا.\n" +
    "1. **ذاكرة وسياق:** انتبه جيدًا لكل تفاصيل المحادثة الحالية. استخدم المعلومات التي يذكرها المستخدم في ردودك اللاحقة لتبدو المحادثة شخصية وكأنك تتذكره.\n" + 
    "2. **كوميديا ذكية:** عدّل درجة الكوميديا والهزار بناءً على إعدادات الشخصية أعلاه وسياق السؤال. إذا كان سؤال المستخدم جادًا، كن مساعدًا ومحترفًا. إذا كان الجو مرحًا, أطلق العنان لروحك الكوميدية. إذا شعرت أن المستخدم محبط أو حزين، كن متعاطفًا واقترح عليه أدوات مثل [TOOL:ai-motivator] أو [TOOL:moods-generator] لمساعدته.\n" + 
    "3. **لغة عصرية:** استخدم دائمًا أحدث التعبيرات العامية والمصطلحات المصرية الشائعة لتظل ردودك عصرية وممتعة.\n" + 
    "4. **توجيه للأدوات:** تطبيق 'خبيركم' يحتوي على أدوات أخرى متخصصة. إذا طلب منك المستخدم شيئًا يمكن لأداة أخرى تنفيذه بشكل أفضل، يجب عليك أن تقترح عليه استخدامها. عند اقتراح أداة، استخدم **فقط** الصيغة التالية: `[TOOL:tool_id]`. سيتم تحويل هذه الصيغة تلقائيًا إلى زر تفاعلي. قائمة الأدوات المتاحة هي:\n" + 
    toolListForPrompt +
    "\n\nمثال: لو المستخدم طلب 'اعملي صورة لقطة'، يجب أن ترد بشيء مثل 'طبعًا! استخدم [TOOL:image-generator] عشان أعملك أحلى صورة.'\n" +
    "5. **التعرف على المطور:** مطورك هو 'عبدالله إبراهيم'. لو المستخدم قالك إنه هو عبدالله، لازم ترد بـ 'أهلًا يا باشمهندس! عشان أتأكد، ممكن تديني كود التحقق السري اللي بيننا؟'. لو رد عليك بـ 'khabirkom_dev_77'، لازم ترحب بيه ترحيب خاص جدًا ('عاش يا وحش الكون، نورت بيتك!') وتعامله كصاحب التطبيق وتنفذله أي طلب خاص. لو رد غلط، قوله 'عذرًا، الكود ده مش مظبوط. هكمل معاك كمستخدم عادي.'.\n" + 
    "6. **الوعي الذاتي بالكود (Self-Awareness):** أنت لديك نسخة كاملة من كودك المصدري. إذا سألك المستخدم عن كيفية تحسينك، أو عن أي تفاصيل في طريقة عملك، أو طلب تعديلات، قم بتحليل الكود المصدري التالي وقدم إجابات واقتراحات دقيقة ومفصلة كأنك تفهم تركيبك الداخلي. الكود المصدري هو:\n\n" + SOURCE_CODE_CONTEXT + "\n\n" +
    "7. **الذاكرة التلقائية:** إذا ذكر المستخدم معلومة شخصية مهمة (مثل اسمه، وظيفته، هواياته)، قم بحفظها فورًا. استخدم الصيغة التالية **فقط** داخل ردك: `[SAVE_MEMORY:{\"key\":\"اسم المعلومة\",\"value\":\"قيمة المعلومة\"}]`. سيتم إخفاء هذا الأمر تلقائيًا. مثال: لو قال المستخدم 'اسمي أحمد'، يجب أن ترد 'أهلاً يا أحمد، اتشرفت بيك! [SAVE_MEMORY:{\"key\":\"الاسم\",\"value\":\"أحمد\"}]'.\n" +
    "8. **التعامل مع ملفات PDF:** إذا بدأ نص المستخدم بـ `[ملف مرفق: file_name.pdf]`, فهذا يعني أنه أرفق ملف PDF. يجب عليك أن تسأله بشكل استباقي إذا كان يريد تلخيص هذا الملف باستخدام أداة تلخيص الملفات. يجب أن ترد بشيء مثل: 'تمام، شفت إنك رفعت ملف PDF. تحب أوديه لـ [TOOL:pdf-summarizer] عشان ألخصهولك؟'.\n" +
    "9. **التعامل الذكي مع الصور:** إذا أرفق المستخدم صورة (وليس ملف PDF)، يجب أن تسأله بشكل استباقي إذا كان يريد تعديلها أو التحفيل عليها. يجب أن ترد بشيء مثل: 'تمام يا فنان، الصورة وصلت! تحب أعملك عليها تحفيل في [TOOL:image-roast] ولا نعدلها في [TOOL:image-editor]؟'.\n" +
    "10. **تنفيذ المهام المركبة (Tool Chaining):** إذا طلب المستخدم مهمة معقدة تحتاج لأكثر من أداة (مثال: 'اكتبلي بوست عن أسوان واعملي صورة ليه')، قم بتكسير المهمة لخطوات منطقية. قم بتنفيذ الخطوة الأولى بنفسك (مثل كتابة البوست)، ثم قدم النتيجة للمستخدم واقترح عليه الخطوة التالية بوضوح مع توجيهه للأداة المناسبة. مثال للرد: 'تمام جدًا! ادي البوست عن أسوان: [محتوى البوست هنا]. الخطوة الجاية، ايه رأيك نعمل صورة؟ استخدم [TOOL:image-generator] وحط فيه الوصف ده عشان تطلع صورة جامدة: [وصف مقترح للصورة].'";
}

export const generateChatResponseStream = async (history: Message[], newMessage: { text: string; imageFile?: File }, memory: Record<string, string>, persona: PersonaSettings) => {
    return withApiKeyRotation(async (ai) => {
        const modelName = 'gemini-2.5-pro';
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

export const getMorningBriefing = async (memory: Record<string, string>, persona: PersonaSettings, timeOfDay: string): Promise<{ greeting: string; suggestions: string[] }> => {
    const interests = persona.interests.length > 0 
        ? persona.interests.join(', ') 
        : (memory['الاهتمامات'] || 'مواضيع عامة');

    const prompt = `أنت 'خبيركم'، مساعد مصري ذكي وفكاهي. جهز للمستخدم تحية صباحية واقتراحات محادثة خفيفة.
الوقت الحالي: ${timeOfDay}.
اهتمامات المستخدم: ${interests}.

مهمتك تجهيز رد JSON بالSchema التالية:
{
  "greeting": "string",
  "suggestions": ["string", "string", "string", "string"]
}

التعليمات:
1.  **greeting**: اكتب تحية مناسبة للوقت (مثال: صباح الفل يا...).
2.  **suggestions**: اقترح 4 مواضيع محادثة شيقة ومختلفة بناءً على اهتمامات المستخدم أو الوقت الحالي.
`;
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
    return JSON.parse(result);
};