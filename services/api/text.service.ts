
import { GenerateContentResponse } from "@google/genai";
import { withApiKeyRotation, EGYPTIAN_PERSONA_INSTRUCTION } from "../geminiService";
import { AnalysisResult } from "../../types";
import { t } from '../localizationService';

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
            systemInstruction: EGYPTIAN_PERSONA_INSTRUCTION(),
            tools: useGrounding ? [{ googleSearch: {} }] : undefined
          }
        });
        return response.text;
    });
};

export const roastText = async (text: string) => {
    const prompt = t('prompts.textRoast', { text });
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const convertDialect = async (text: string, dialect: string) => {
    const prompt = t('prompts.dialectConverter', { text, dialect });
    const result = await callGemini('gemini-flash-latest', prompt);
    return result;
};

export const summarizeNews = async (newsText: string) => {
    const prompt = t('prompts.newsSummarizer', { newsText });
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const generateMoodContent = async (text: string) => {
    const prompt = t('prompts.moodsGenerator', { text });
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const interpretDream = async (dream: string) => {
    const prompt = t('prompts.dreamInterpreter', { dream });
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const generateRecipe = async (ingredients: string) => {
    const prompt = t('prompts.recipeGenerator', { ingredients });
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const generateStory = async (scenario: string) => {
    const prompt = t('prompts.storyMaker', { scenario });
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const summarizeLongText = async (text: string) => {
    const prompt = t('prompts.pdfSummarizer', { text });
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const teachTopic = async (topic: string) => {
    const prompt = t('prompts.aiTeacher', { topic });
    return await callGemini('gemini-3-pro-preview', prompt);
};

export const generateLoveMessage = async (type: string) => {
    const prompts: { [key: string]: string } = t('prompts.aiLoveMessages.prompts', { returnObjects: true });
    return await callGemini('gemini-flash-latest', prompts[type]);
};

export const generatePost = async (type: string) => {
    const prompts: { [key: string]: string } = t('prompts.postGenerator.prompts', { returnObjects: true });
    return await callGemini('gemini-flash-latest', prompts[type]);
};

export const convertTextToStyle = async (text: string, style: string) => {
    const prompts: { [key: string]: string } = t('prompts.textConverter.prompts', { returnObjects: true });
    const fullPrompt = `${prompts[style]}\n\n"${text}"`;
    return await callGemini('gemini-3-pro-preview', fullPrompt);
};

export const generateNames = async (category: string) => {
    const prompt = t('prompts.nameGenerator', { category });
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result).names;
};

export const analyzeHabits = async (habitAnswers: string) => {
    const prompt = t('prompts.habitAnalyzer', { habitAnswers });
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const getGrumpyMotivation = async () => {
    const prompt = t('prompts.aiMotivator');
    return await callGemini('gemini-flash-latest', prompt);
};

export const explainCode = async (code: string) => {
    const prompt = t('prompts.codeExplainer', { code });
    const result = await callGemini('gemini-3-pro-preview', prompt, true);
    return JSON.parse(result);
};

export const organizeTasks = async (input: string) => {
    const prompt = t('prompts.taskManager', { input });
    const result = await callGemini('gemini-flash-latest', prompt, true);
    return JSON.parse(result);
};

export const comparePrices = async (product: string) => {
    const prompt = t('prompts.priceComparator', { product });
    // We use gemini-flash-latest with grounding enabled (passed as true)
    return await callGemini('gemini-flash-latest', prompt, false, true);
};

export const analyzeVoice = async (audioFile: File): Promise<AnalysisResult> => {
    console.log("Analyzing audio file (mock):", audioFile.name);
    return new Promise(resolve => setTimeout(() => resolve({
        mood: t('tools.voiceAnalysis.mockResults.mood'),
        energy: t('tools.voiceAnalysis.mockResults.energy'),
        roast: t('tools.voiceAnalysis.mockResults.roast'),
        advice: t('tools.voiceAnalysis.mockResults.advice')
    }), 1000));
};
