import prompts from "../data/prompts.json" with {type: "json"};
import { Geminai_explanation } from "../services/geminiAPI.js";

// Edita o prompt tamplet, coloca o nome do estado 
function edit_propts(id, state) {
    const question = prompts.questions.find((q) => q.id === id);

    if (!question) {
        throw new Error(`Nenhuma pergunta encontrada com id ${id}`);
    }

    return question.prompt.replace("{state}", state);
}

async function output_prompt_html(id, state) {
    const prompt = edit_propts(id, state);
    const response = await Geminai_explanation(prompt);
    
    // Tentativa de extrair o texto de diferentes formatos de resposta da API
    const respostaTexto = response?.choices?.[0]?.message?.content || response?.text || response;

    return `<p>${respostaTexto}</p>`;
}

export { edit_propts, output_prompt_html };