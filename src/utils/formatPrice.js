export function formatPrice(value) {
  return `${Math.round(value * 40).toLocaleString("fr-FR")} MRU`;
}
