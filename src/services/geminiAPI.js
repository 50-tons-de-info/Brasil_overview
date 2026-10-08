import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6IFiLuP6wN9c6yygBkWGmnNsCeyZdluGfJI8e4k000k4g" });

export async function Geminai_explanation(propmt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash", // Utilizando a versão mais rápida e suportada na nova SDK
        contents: propmt,
    });
    return response.text;
}
