import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerEntrega from "../assets/rastreamento_de_cargas-scaled.webp";

export default function NovaEntrega() {
  const [destinatario, setDestinatario] = useState("");
  const [endereco, setEndereco] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [coordenadas, setCoordenadas] = useState(null);
  const navigate = useNavigate();

  const handleEnderecoChange = async (e) => {
    const value = e.target.value;
    setEndereco(value);

    if (value.length > 2) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
      );
      const data = await response.json();
      setSugestoes(data);
    } else {
      setSugestoes([]);
    }
  };

  const handleSugestaoClick = (sugestao) => {
    setEndereco(sugestao.display_name);
    setCoordenadas({
      latitude: parseFloat(sugestao.lat),
      longitude: parseFloat(sugestao.lon),
    });
    setSugestoes([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coordenadas) {
      alert("Por favor, selecione um endereço válido da lista.");
      return;
    }

    const entregasExistentes = JSON.parse(localStorage.getItem("entregas")) || [];

    const ultimoId = entregasExistentes.length > 0
      ? Math.max(...entregasExistentes.map((e) => parseInt(e.id || 0)))
      : 0;

    const novaEntrega = {
      id: (ultimoId + 1).toString(),
      destinatario,
      endereco,
      latitude: coordenadas.latitude,
      longitude: coordenadas.longitude,
      status: "pendente",
      createdAt: new Date().toISOString(),
    };

    entregasExistentes.push(novaEntrega);
    localStorage.setItem("entregas", JSON.stringify(entregasExistentes));

    navigate("/");
  };

  return (
    <div className="container mt-4">
      <img
        src={bannerEntrega}
        alt="Entrega"
        className="img-fluid rounded shadow-sm mb-4"
        style={{ maxHeight: "220px", objectFit: "cover", width: "100%" }}
      />
      <div className="bg-white p-4 rounded shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="mb-3 text-center fw-bold text-dark">
          <i className="bi bi-plus-square-dotted me-2 text-primary"></i>
          Nova Entrega
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Destinatário</label>
            <input
              type="text"
              className="form-control"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Endereço</label>
            <input
              type="text"
              className="form-control"
              value={endereco}
              onChange={handleEnderecoChange}
              required
              autoComplete="off"
            />
            {sugestoes.length > 0 && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 999 }}>
                {sugestoes.map((sugestao, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSugestaoClick(sugestao)}
                    style={{ cursor: "pointer" }}
                  >
                    {sugestao.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="btn btn-viarota w-100">
            <i className="bi bi-check-circle me-2"></i>
            Salvar Entrega
          </button>
        </form>
      </div>
    </div>
  );
}