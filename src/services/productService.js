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

// Liste des catégories DummyJSON : [{ slug, name, url }]
export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Impossible de charger les catégories");
  }

  return response.json();
}

let allProductsCache = null;

// Catalogue complet (mis en cache en mémoire) : sert à "Tous les produits" et à la recherche
export async function getAllProducts() {
  if (allProductsCache) return allProductsCache;

  const response = await fetch(`${BASE_URL}?limit=0`);

  if (!response.ok) {
    throw new Error("Impossible de charger les produits");
  }

  const data = await response.json();
  allProductsCache = data.products || [];
  return allProductsCache;
}

// Recherche insensible à la casse sur le nom, la catégorie, la marque et la description
export async function searchProducts(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const products = await getAllProducts();

  return products.filter((product) => {
    const haystack = [product.title, product.category, product.brand, product.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
