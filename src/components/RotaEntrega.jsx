import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

function Roteador({ origem, destino }) {
  const map = useMap();

  useEffect(() => {
    if (!origem || !destino) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(origem[0], origem[1]), L.latLng(destino[0], destino[1])],
      routeWhileDragging: false,
      show: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, origem, destino]);

  return null;
}

export default function RotaEntrega({ destino }) {
  const [origem, setOrigem] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigem([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        setOrigem([-15.7942, -47.8822]); // fallback: Brasília
      }
    );
  }, []);

  if (!origem) return <p>Carregando mapa...</p>;

  return (
    <MapContainer center={origem} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Roteador origem={origem} destino={[destino.latitude, destino.longitude]} />
    </MapContainer>
  );
}
