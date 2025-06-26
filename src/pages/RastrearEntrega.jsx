import { useEffect, useState } from "react";
import { getEntregas } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

function calcularDistancia(coord1, coord2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calcularEstimativa(distanciaKm) {
  const minutos = Math.round((distanciaKm * 60) / 100);
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${horas}h ${minutosRestantes}min`;
}

export default function RastrearEntrega() {
  const [posicao, setPosicao] = useState(null);
  const [entregaMaisProxima, setEntregaMaisProxima] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setPosicao(coords);

        const entregas = getEntregas().filter((e) => e.latitude && e.longitude);
        if (entregas.length === 0) return;

        let menor = null;
        let menorDistancia = Infinity;

        for (const entrega of entregas) {
          const distancia = calcularDistancia(coords, entrega);
          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            menor = { ...entrega, distancia };
          }
        }

        if (menor) {
          menor.tempoEstimado = calcularEstimativa(menor.distancia);
          menor.status =
            menor.distancia < 1
              ? "Entrega próxima"
              : menor.distancia < 5
              ? "Em trânsito"
              : "A caminho";
          setEntregaMaisProxima(menor);
        }
      },
      () => {
        alert("Erro ao obter sua localização");
      }
    );
  }, []);

  return (
    <div className="container mt-4">
      

      <h2 className="text-center fw-bold text-dark mb-3">
        <i className="bi bi-geo-alt-fill me-2"></i>
        Sua Localização Atual
      </h2>

      {posicao && (
        <MapContainer
          center={[posicao.latitude, posicao.longitude]}
          zoom={13}
          style={{ height: "400px", width: "100%", borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.1)" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[posicao.latitude, posicao.longitude]} icon={icon}>
            <Popup>Você está aqui</Popup>
          </Marker>
        </MapContainer>
      )}

      {entregaMaisProxima && (
        <div className="card mt-4 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title fw-bold">
              <i className="bi bi-box2-heart me-2 text-success"></i>
              Entrega Mais Próxima
            </h5>
            <p><i className="bi bi-person-fill me-2 text-primary"></i><strong>Destinatário:</strong> {entregaMaisProxima.destinatario}</p>
            <p><i className="bi bi-geo-alt me-2 text-danger"></i><strong>Endereço:</strong> {entregaMaisProxima.endereco}</p>
            <p><i className="bi bi-truck me-2 text-warning"></i><strong>Status:</strong> {entregaMaisProxima.status}</p>
            <p><i className="bi bi-signpost me-2"></i><strong>Distância:</strong> {entregaMaisProxima.distancia.toFixed(2)} km</p>
            <p><i className="bi bi-clock-history me-2"></i><strong>Tempo estimado:</strong> {entregaMaisProxima.tempoEstimado}</p>
          </div>
        </div>
      )}

      {!posicao && (
        <div className="alert alert-info">
          Obtendo sua localização atual...
        </div>
      )}
    </div>
  );
}