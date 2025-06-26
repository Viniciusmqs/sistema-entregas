import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView({ position, label = "Destino" }) {
  return (
    <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}
