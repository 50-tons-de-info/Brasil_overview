import MapBrazil from "../components/MapBrazil";

function Home() {
  return (
    <main>
      <header style={{ backgroundColor: "#2e7d32", padding: "20px", color: "white" }}>
        <h1>Overview dos estados brasileiros</h1>
        
      </header>
      
      <section style={{ padding: "40px", textAlign: "center" }}>
        <h2>Selecione um Estado</h2>
        
        
        <MapBrazil />
      </section>
      
      <footer style={{ marginTop: "50px", borderTop: "1px solid #ccc", padding: "20px" }}>
        <p>Sistemas Distribuídos - 2026</p>
        <p></p>
      </footer>
    </main>
  );
}

export default Home;
