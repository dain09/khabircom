import { GenerateContentResponse, Modality } from "@google/genai";
import { fileToGenerativePart } from "../../utils/fileUtils";
import { withApiKeyRotation, EGYPTIAN_PERSONA_INSTRUCTION } from "../geminiService";

const callGemini = async (
    modelName: 'gemini-2.5-pro' | 'gemini-flash-latest',
    prompt: any[],
    isJson = false
): Promise<string> => {
    return withApiKeyRotation(async (ai) => {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: modelName,
          contents: { parts: prompt },
          config: { 
            responseMimeType: isJson ? 'application/json' : 'text/plain',
            systemInstruction: EGYPTIAN_PERSONA_INSTRUCTION
          }
        });
        return response.text;
    });
};

export const roastImage = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `حلل الصورة دي وطلعلي roast كوميدي، تحليل واقعي، ونصيحة لتحسين اللي في الصورة (سواء شخص، لبس، أوضة، أو أي حاجة). الرد يكون بصيغة JSON بالSchema دي:\n{\n  "roast": "string",\n  "analysis": "string",\n  "advice": "string"\n}`;
    const result = await callGemini('gemini-2.5-pro', [imagePart, { text: prompt }], true);
    return JSON.parse(result);
};

export const generateMemeSuggestions = async (imageFile: File) => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `اختر لي 5 اقتراحات ميم (كابشنز) تفرط من الضحك للصورة دي. الرد يكون بصيغة JSON بالSchema دي:\n{\n "suggestions": ["string", "string", "string", "string", "string"] \n}`;
    const result = await callGemini('gemini-2.5-pro', [imagePart, { text: prompt }], true);
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

        throw new Error("لم يتمكن الخبير من توليد الصورة. حاول مرة أخرى بوصف مختلف أو تأكد أن طلبك لا يخالف سياسات الاستخدام.");
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

        throw new Error("لم يتمكن الخبير من تعديل الصورة. حاول مرة أخرى بوصف مختلف أو تأكد أن طلبك لا يخالف سياسات الاستخدام.");
    });
};