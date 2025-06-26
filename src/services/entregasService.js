const STORAGE_KEY = "entregas";

// Gera um ID numérico incremental baseado no que existe no localStorage
function gerarNovoId(entregas) {
  if (entregas.length === 0) return "1";

  const idsValidos = entregas
    .map(e => parseInt(e.id))
    .filter(id => !isNaN(id));

  const maiorId = idsValidos.length > 0 ? Math.max(...idsValidos) : 0;
  return (maiorId + 1).toString();
}

// Salva a entrega no localStorage com ID e coordenadas
export function salvarEntrega(entrega) {
  const entregas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const novaEntrega = {
    id: gerarNovoId(entregas),
    destinatario: entrega.destinatario,
    endereco: entrega.endereco,
    status: "pendente",
    latitude: entrega.latitude || -15.7942, // fallback se não vier
    longitude: entrega.longitude || -47.8822,
  };

  entregas.push(novaEntrega);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entregas));
}

// Lista todas as entregas
export function listarEntregas() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Busca uma entrega específica pelo ID
export function buscarEntregaPorId(id) {
  const entregas = listarEntregas();
  return entregas.find(e => e.id === id);
}
