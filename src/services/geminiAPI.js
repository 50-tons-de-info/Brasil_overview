import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6JaEbZ0CoUjOs7HA0PTWfvCDbuyxX4F_H9fcMKJjRoZOQ" });

export async function Geminai_explanation(propmt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash", // Utilizando a versão mais rápida e suportada na nova SDK
        contents: propmt,
    });
    return response.text;
}
