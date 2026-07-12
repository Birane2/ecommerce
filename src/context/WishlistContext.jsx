/* eslint-disable react-refresh/only-export-components -- provider + hook colocated on purpose */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "ecommerce_wishlist";

const WishlistContext = createContext(null);

function loadWishlistFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(loadWishlistFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isWishlisted = useCallback(
    (id) => wishlistItems.some((item) => item.id === id),
    [wishlistItems]
  );

  // Ajoute ou retire le produit ; renvoie "added" ou "removed" pour piloter le toast à l'appel
  const toggleWishlist = useCallback((product) => {
    let result = "added";

    setWishlistItems((prev) => {
      const alreadyIn = prev.some((item) => item.id === product.id);

      if (alreadyIn) {
        result = "removed";
        return prev.filter((item) => item.id !== product.id);
      }

      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
        },
      ];
    });

    return result;
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
    }),
    [wishlistItems, isWishlisted, toggleWishlist, removeFromWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist doit être utilisé à l'intérieur d'un WishlistProvider");
  }
  return context;
}
