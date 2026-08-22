// função que retorna o resumo do estado
export default function StateResume({ resume, title }) {
  if (!resume) {
    return <p>Aguardando resumo...</p>;
  }

  return (
    <div className="state-resume-box">
      {title && <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>Sobre {title}</h3>}
      <p style={{ margin: 0 }}>{resume}</p>
    </div>
  );
}