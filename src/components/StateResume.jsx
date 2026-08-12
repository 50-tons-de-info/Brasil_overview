// função que retorna um paragrafo recebe o texto da openAI

export default function StateResume({ resume, title }) {
    if (!resume) {
        return <p>Aguardando</p>;
    }

    return <p>{resume}</p>;
}