const BASE_URL = "https://dummyjson.com/products";

async function getProductsByCategory(category) {
  const response = await fetch(`${BASE_URL}/category/${category}`);

  if (!response.ok) {
    throw new Error("Impossible de charger les produits");
  }

  const data = await response.json();
  return data.products || [];
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Produit introuvable");
  }

  return response.json();
}

export { getProductsByCategory };

export function getSmartphones() {
  return getProductsByCategory("smartphones");
}

export function getMobileAccessories() {
  return getProductsByCategory("mobile-accessories");
}

export function getLaptops() {
  return getProductsByCategory("laptops");
}

export function getTablets() {
  return getProductsByCategory("tablets");
}

export function getSunglasses() {
  return getProductsByCategory("sunglasses");
}

export function getSportsAccessories() {
  return getProductsByCategory("sports-accessories");
}
