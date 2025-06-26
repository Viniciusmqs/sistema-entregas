const KEY = "entregas";

export function getEntregas() {
  const dados = localStorage.getItem(KEY);
  return dados ? JSON.parse(dados) : [];
}

export function salvarEntrega(entrega) {
  const entregas = getEntregas();
  entregas.push(entrega);
  localStorage.setItem(KEY, JSON.stringify(entregas));
}

export function buscarEntregaPorId(id) {
  const entregas = getEntregas();
  return entregas.find((e) => e.id === id);
}
