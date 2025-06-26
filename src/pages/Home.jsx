import { useEffect, useState } from "react";
import { getEntregas } from "../services/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function calcularDistanciaEmKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatarTempo(minutos) {
  const horas = Math.floor(minutos / 60);
  const mins = Math.round(minutos % 60);
  return `${horas}h ${mins}min`;
}

function definirStatus(minutos) {
  if (minutos > 90) return { label: "Pendente", bgClass: "bg-warning text-dark", icon: "bi-hourglass-split" };
  if (minutos > 60) return { label: "A caminho", bgClass: "bg-secondary", icon: "bi-truck" };
  if (minutos > 15) return { label: "Próximo", bgClass: "bg-info", icon: "bi-box-seam" };
  return { label: "Entregue", bgClass: "bg-success", icon: "bi-check-circle" };
}

export default function Home() {
  const [entregas, setEntregas] = useState([]);
  const [origem, setOrigem] = useState(null);

  useEffect(() => {
    const dados = getEntregas();
    setEntregas(dados);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigem([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setOrigem([-15.7942, -47.8822]);
      }
    );
  }, []);

  return (
    <div className="container-fluid px-4 py-5" style={{ background: "linear-gradient(to bottom, #f1f3f5, #e9ecef)" }}>
      <h2 className="mb-5 text-center fw-bold display-5 text-dark">
        <i className="bi bi-clipboard-data me-2"></i>
        Entregas Registradas
      </h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {entregas.map((entrega) => {
          let estimativa = "Calculando...";
          let status = { label: "Pendente", bgClass: "bg-warning text-dark", icon: "bi-hourglass-split" };

          if (origem && entrega.latitude && entrega.longitude) {
            const km = calcularDistanciaEmKm(
              origem[0],
              origem[1],
              entrega.latitude,
              entrega.longitude
            );
            const minutos = (km * 60) / 100;
            estimativa = formatarTempo(minutos);
            status = definirStatus(minutos);
          }

          return (
            <div className="col" key={entrega.id}>
              <div
                className={`card h-100 border-0 text-white ${status.bgClass}`}
                style={{
                  transition: "transform 0.3s",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className={`bi ${status.icon} fs-1 me-3`}></i>
                    <h5 className="card-title mb-0">Entrega #{entrega.id}</h5>
                  </div>
                  <p><strong>Destinatário:</strong> {entrega.destinatario}</p>
                  <p><strong>Endereço:</strong> {entrega.endereco}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`badge px-3 py-2 rounded-pill ${status.bgClass}`}>
                      <i className={`bi ${status.icon} me-2`}></i>
                      {status.label}
                    </span>
                  </p>
                  <p><strong>Estimativa:</strong> {estimativa}</p>
                </div>
                <div className="card-footer bg-transparent border-top-0 text-end">
                  <Link to={`/entrega/${entrega.id}`} className="btn btn-light btn-sm">
                    <i className="bi bi-search me-1"></i>
                    Rastrear Entrega
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}