import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "" });

export async function Geminai_explanation(propmt) {
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash", // Utilizando a versão mais rápida e suportada na nova SDK
        contents: propmt,
    });
    return response.text;
}
