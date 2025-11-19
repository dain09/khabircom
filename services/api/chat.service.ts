
import { GenerateContentResponse, Content } from "@google/genai";
import { fileToGenerativePart } from "../../utils/fileUtils";
import { Message, PersonaSettings } from "../../types";
import { TOOLS } from '../../constants';
import { withApiKeyRotation } from "../geminiService";
import { t } from '../localizationService';

const getChatPersonaInstruction = (memory: Record<string, string>, persona: PersonaSettings): string => {
    const isFahimkom = persona.humor > 7 && persona.verbosity < 5;
    
    let identityBlock = isFahimkom 
        ? t('personas.fahimkom.instructions')
        : t('personas.khabirkom.instructions');

    let memoryContext = "";
    const memoryKeys = Object.keys(memory);
    if (memoryKeys.length > 0) {
        memoryContext = "\n\n--- " + t('personas.memory.header') + " ---\n" +
                        memoryKeys.map(key => `- ${key}: ${memory[key]}`).join('\n') +
                        "\n--- " + t('personas.memory.footer') + " ---";
    }

    const toolListForPrompt = TOOLS
        .filter(t => t.id !== 'chat')
        .map(tool => `- ${t(tool.title)} (${t('personas.tools.idPrompt')}: ${tool.id})`)
        .join('\n');

    const generalInstructions = t('personas.generalInstructions', {
        toolList: toolListForPrompt,
        returnObjects: true
    }) as string[];

    return identityBlock + memoryContext + "\n\n" + generalInstructions.join("\n");
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

    const interests = persona.interests.length > 0 ? persona.interests.join(', ') : (memory['الاهتمامات'] || t('common.generalTopics'));
    const personalityInstruction = botName === t('personas.fahimkom.name') ? t('personas.fahimkom.briefingPrompt') : t('personas.khabirkom.briefingPrompt');

    const prompt = t('personas.briefing.mainPrompt', { personality: personalityInstruction, timeOfDay, interests });
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
        return { greeting: t('personas.briefing.fallback.greeting', { botName }), suggestions: t('personas.briefing.fallback.suggestions', { returnObjects: true }) as string[] };
    }
};

export const generateConversationTitle = async (messages: Message[]): Promise<string> => {
    const conversationContext = messages.slice(0, 3).map(m => `${m.role}: ${m.parts[0].text.substring(0, 100)}`).join('\n');
    const prompt = t('personas.titleGenerationPrompt', { context: conversationContext });
    return withApiKeyRotation(async (ai) => {
        const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: prompt });
        return response.text.trim().replace(/["']/g, '');
    });
};
