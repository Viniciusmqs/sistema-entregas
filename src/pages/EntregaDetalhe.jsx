import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { buscarEntregaPorId } from "../services/api";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import bannerEntrega from "../assets/rastreamento-de-cargas.jpg";

function Rota({ origem, destino }) {
  const map = useMap();

  useEffect(() => {
    if (!origem || !destino) return;

    const rota = L.Routing.control({
      waypoints: [
        L.latLng(origem[0], origem[1]),
        L.latLng(destino[0], destino[1]),
      ],
      routeWhileDragging: false,
      createMarker: () => null,
    }).addTo(map);

    return () => map.removeControl(rota);
  }, [map, origem, destino]);

  return null;
}

export default function EntregaDetalhe() {
  const { id } = useParams();
  const [entrega, setEntrega] = useState(null);
  const [origem, setOrigem] = useState(null);

  useEffect(() => {
    const e = buscarEntregaPorId(id);
    if (e) setEntrega(e);
  }, [id]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigem([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setOrigem([-15.7942, -47.8822]); // fallback: Brasília
      }
    );
  }, []);

  if (!entrega) return <p className="text-danger">Entrega não encontrada.</p>;
  if (!origem) return <p>Carregando mapa...</p>;

  const destino = [entrega.latitude, entrega.longitude];

  return (
    <div className="container mt-4 mb-5">
      <img
        src={bannerEntrega}
                alt="Entrega"
                className="img-fluid rounded shadow-sm mb-4"
                style={{ maxHeight: "220px", objectFit: "cover", width: "100%" }}
      />

      <h2 className="fw-bold mb-3 text-dark">
        <i className="bi bi-box-seam me-2"></i>
        Detalhes da Entrega #{entrega.id}
      </h2>

      <p><i className="bi bi-person-fill me-2 text-primary"></i><strong>Destinatário:</strong> {entrega.destinatario}</p>
      <p><i className="bi bi-geo-alt-fill me-2 text-danger"></i><strong>Endereço:</strong> {entrega.endereco}</p>
      <p>
        <i className="bi bi-info-circle-fill me-2 text-warning"></i>
        <strong>Status:</strong>{" "}
        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
          {entrega.status.charAt(0).toUpperCase() + entrega.status.slice(1)}
        </span>
      </p>

      <div className="mt-4 mb-5">
        <h5 className="mb-5">
          <i className="bi bi-map-fill me-2 text-success"></i>
          Rota da Entrega
        </h5>
        <MapContainer
          center={origem}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%", borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.1)" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Rota origem={origem} destino={destino} />
        </MapContainer>
      </div>
    </div>
  );
}