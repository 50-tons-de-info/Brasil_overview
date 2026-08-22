const wikipedia_api = "https://pt.wikipedia.org/api/rest_v1/page/summary/";

export async function states_resume(title){
    const url = `${wikipedia_api}${encodeURIComponent(title)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro ao buscar dados da Wikipedia para "${title}"`);
    }
    return response.json();
}