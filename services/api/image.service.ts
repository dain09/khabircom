
import { GenerateContentResponse, Modality } from "@google/genai";
import { fileToGenerativePart } from "../../utils/fileUtils";
import { withApiKeyRotation, EGYPTIAN_PERSONA_INSTRUCTION } from "../geminiService";
import { t } from '../localizationService';

const callGemini = async (
    modelName: 'gemini-3-pro-preview' | 'gemini-flash-latest',
    prompt: any[],
    isJson = false
): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: modelName,
          contents: { parts: prompt },
          config: { 
            responseMimeType: isJson ? 'application/json' : 'text/plain',
            systemInstruction: EGYPTIAN_PERSONA_INSTRUCTION()
          }
        });
        return response.text;
    });
};

export const roastImage = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = t('prompts.imageRoast');
    const result = await callGemini('gemini-3-pro-preview', [imagePart, { text: prompt }], true);
    return JSON.parse(result);
};

export const generateMemeSuggestions = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = t('prompts.memeGenerator');
    const result = await callGemini('gemini-3-pro-preview', [imagePart, { text: prompt }], true);
    return JSON.parse(result).suggestions;
};

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

        throw new Error(t('errors.imageGeneration'));
    });
};

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

        throw new Error(t('errors.imageEditing'));
    });
};
