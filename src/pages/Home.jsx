import bgTexture from "../assets/textures/stone2.jpg";
import headerTexture from "../assets/textures/03intonacorovinato2.jpg";
import MapBrazil from "../components/MapBrazil";

function Home() {
  return (
    <main style={{ backgroundImage: `url(${bgTexture})`, backgroundRepeat: "repeat", backgroundColor: "rgb(136, 125, 108)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ backgroundImage: `url(${headerTexture})`, backgroundSize: "cover", backgroundPosition: "center", padding: "20px", color: "white" }}>
        <h1 className="home-title">Overview dos estados brasileiros</h1>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <section style={{ padding: "40px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2>Selecione um Estado</h2>
          <MapBrazil />
        </section>

        <aside style={{ padding: "40px", flex: 1 }}>
          {/* Espaço reservado para os detalhes do estado à direita */}
        </aside>
      </div>


    </main>
  );
}

export default Home;
