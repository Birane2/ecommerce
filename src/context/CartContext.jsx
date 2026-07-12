/* eslint-disable react-refresh/only-export-components -- provider + hook colocated on purpose */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const STORAGE_KEY = "ecommerce_cart";
const SHIPPING_FEE = 5; // frais fixes en unité produit (≈ 200 MRU)
const FREE_SHIPPING_THRESHOLD = 100; // panier offert à partir de ≈ 4000 MRU

const CartContext = createContext(null);

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existing = state.find((item) => item.id === product.id);

      if (existing) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item
        );
      }

      return [
        ...state,
        {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    }

    case "INCREMENT":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
          : item
      );

    case "DECREMENT":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      );

    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload.id);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, undefined, loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajoute un produit ; renvoie la quantité réellement ajoutée si le stock limite l'opération
  const addToCart = useCallback(
    (product, quantity = 1) => {
      const existing = cartItems.find((item) => item.id === product.id);
      const currentQuantity = existing?.quantity || 0;
      const maxAddable = Math.max(product.stock - currentQuantity, 0);
      const addedQuantity = Math.min(quantity, maxAddable);

      if (addedQuantity > 0) {
        dispatch({ type: "ADD_ITEM", payload: { product, quantity: addedQuantity } });
      }

      return { addedQuantity, limitedByStock: addedQuantity < quantity };
    },
    [cartItems]
  );

  const incrementItem = useCallback((id) => {
    dispatch({ type: "INCREMENT", payload: { id } });
  }, []);

  const decrementItem = useCallback((id) => {
    dispatch({ type: "DECREMENT", payload: { id } });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const isInCart = useCallback(
    (id) => cartItems.some((item) => item.id === id),
    [cartItems]
  );

  const totals = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    return { itemCount, subtotal, shipping, total };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      incrementItem,
      decrementItem,
      removeFromCart,
      clearCart,
      isInCart,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      ...totals,
    }),
    [cartItems, addToCart, incrementItem, decrementItem, removeFromCart, clearCart, isInCart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
}
