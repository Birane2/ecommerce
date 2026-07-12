import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaCartShopping, FaTruckFast } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";
import "./cart.css";

function CartPage() {
  const {
    cartItems,
    incrementItem,
    decrementItem,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    total,
    itemCount,
    freeShippingThreshold,
  } = useCart();
  const { showToast } = useToast();

  function handleRemove(item) {
    removeFromCart(item.id);
    showToast(`"${item.title}" retiré du panier`, "info");
  }

  function handleClearCart() {
    clearCart();
    showToast("Panier vidé", "info");
  }

  function handleCheckout() {
    showToast("Redirection vers le paiement...");
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart_page">
        <div className="container empty_cart">
          <FaCartShopping className="empty_cart_icon" />
          <h2>Votre panier est vide</h2>
          <p>Parcourez nos produits et ajoutez vos coups de cœur au panier.</p>
          <Link to="/" className="btn btn_primary">
            Continuer mes achats
          </Link>
        </div>
      </main>
    );
  }

  const amountLeftForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <main className="cart_page">
      <div className="container">
        <h1 className="cart_title">Mon panier ({itemCount})</h1>

        <div className="cart_layout">
          <div className="cart_items">
            {cartItems.map((item) => (
              <article className="cart_item" key={item.id}>
                <Link to={`/product/${item.id}`} className="cart_item_image">
                  <img src={item.thumbnail} alt={item.title} loading="lazy" />
                </Link>

                <div className="cart_item_info">
                  <Link to={`/product/${item.id}`} className="cart_item_title">
                    {item.title}
                  </Link>
                  <p className="cart_item_price">{formatPrice(item.price)}</p>
                </div>

                <div className="cart_item_quantity">
                  <button
                    type="button"
                    onClick={() => decrementItem(item.id)}
                    disabled={item.quantity <= 1}
                    aria-label={`Diminuer la quantité de ${item.title}`}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => incrementItem(item.id)}
                    disabled={item.quantity >= item.stock}
                    aria-label={`Augmenter la quantité de ${item.title}`}
                  >
                    <FaPlus />
                  </button>
                </div>

                <p className="cart_item_total">
                  {formatPrice(item.price * item.quantity)}
                </p>

                <button
                  type="button"
                  className="cart_item_remove"
                  onClick={() => handleRemove(item)}
                  aria-label={`Retirer ${item.title} du panier`}
                >
                  <FaTrash />
                </button>
              </article>
            ))}

            <button type="button" className="clear_cart_btn" onClick={handleClearCart}>
              Vider le panier
            </button>
          </div>

          <aside className="cart_summary">
            <h2>Récapitulatif</h2>

            <div className="summary_row">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary_row">
              <span>Livraison</span>
              <span>{shipping === 0 ? "Gratuite" : formatPrice(shipping)}</span>
            </div>

            {amountLeftForFreeShipping > 0 ? (
              <p className="free_shipping_hint">
                <FaTruckFast /> Ajoutez {formatPrice(amountLeftForFreeShipping)} pour
                bénéficier de la livraison gratuite.
              </p>
            ) : (
              <p className="free_shipping_hint free_shipping_hint_active">
                <FaTruckFast /> Livraison gratuite appliquée !
              </p>
            )}

            <div className="summary_row summary_total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button type="button" className="btn btn_primary checkout_btn" onClick={handleCheckout}>
              Passer la commande
            </button>

            <Link to="/" className="continue_shopping_link">
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
