import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NovaEntrega from "./pages/NovaEntrega";
import RastrearEntrega from "./pages/RastrearEntrega";
import Header from "./components/Header";
import EntregaDetalhe from "./pages/EntregaDetalhe";



export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nova-entrega" element={<NovaEntrega />} />
        <Route path="/rastrear" element={<RastrearEntrega />} />
        <Route path="/entrega/:id" element={<EntregaDetalhe />} />
      </Routes>
    </BrowserRouter>
  );
}
