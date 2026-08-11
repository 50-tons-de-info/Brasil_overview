import { BrowserRouter, Routes, Route } from "react-router-dom";
    import Home from "./pages/Home"; // <--- Importamos a nova Home
    import StateDetail from "./pages/StateDetail";
    import "./App.css";

    function App() {
      return (
        <BrowserRouter>
          <Routes>
            {/* Agora a página inicial carrega a Home */}
            <Route path="/" element={<Home />} />
            <Route path="/state/:code" element={<StateDetail />} />
          </Routes>
        </BrowserRouter>
      );
    }

    export default App;