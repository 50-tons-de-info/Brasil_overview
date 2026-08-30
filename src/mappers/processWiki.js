export function wiki_response(raw) {
    return {
    titulo: raw.title,
    resumo: raw.extract,
    imagem: raw.thumbnail?.source ?? null,
    linkCompleto: raw.content_urls?.desktop?.page ?? null,
  };
}