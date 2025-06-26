import { Link } from "react-router-dom";
import logo from "../assets/logo-via-rota-removebg-preview.png";

export default function Header() {
  return (
    <nav className="navbar navbar-light bg-white px-4 shadow-sm d-flex justify-content-between align-items-center">
      <img src={logo} alt="ViaRota Logo" height="80" />
      <div className="navbar-nav d-flex flex-row gap-3">
        <Link className="nav-link fw-semibold" to="/">Entregas</Link>
        <Link className="nav-link fw-semibold" to="/nova-entrega">Nova Entrega</Link>
        <Link className="nav-link fw-semibold" to="/rastrear">Rastrear</Link>
      </div>
    </nav>
  );
}