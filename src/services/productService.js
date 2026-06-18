const API_URL = "https://dummyjson.com/products/category";

async function getProductsByCategory(category) {
  const response = await fetch(`${API_URL}/${category}`);

  if (!response.ok) {
    throw new Error("Impossible de charger les produits");
  }

  const data = await response.json();
  return data.products || [];
}

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
