import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaMinus, FaPlus, FaTrash, FaCartShopping, FaTruckFast } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";
import "./cart.css";

function CartPage() {
  const { t } = useTranslation();
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
    showToast(t("cart.toastRemoved", { title: item.title }), "info");
  }

  function handleClearCart() {
    clearCart();
    showToast(t("cart.toastCleared"), "info");
  }

  function handleCheckout() {
    showToast(t("cart.toastCheckout"));
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart_page">
        <div className="container empty_cart">
          <FaCartShopping className="empty_cart_icon" />
          <h2>{t("cart.emptyTitle")}</h2>
          <p>{t("cart.emptyText")}</p>
          <Link to="/" className="btn btn_primary">
            {t("cart.continueShopping")}
          </Link>
        </div>
      </main>
    );
  }

  const amountLeftForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <main className="cart_page">
      <div className="container">
        <h1 className="cart_title">{t("cart.title", { count: itemCount })}</h1>

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
                    aria-label={t("cart.decreaseQuantity", { title: item.title })}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => incrementItem(item.id)}
                    disabled={item.quantity >= item.stock}
                    aria-label={t("cart.increaseQuantity", { title: item.title })}
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
                  aria-label={t("cart.removeItem", { title: item.title })}
                >
                  <FaTrash />
                </button>
              </article>
            ))}

            <button type="button" className="clear_cart_btn" onClick={handleClearCart}>
              {t("cart.clearCart")}
            </button>
          </div>

          <aside className="cart_summary">
            <h2>{t("cart.summary")}</h2>

            <div className="summary_row">
              <span>{t("cart.subtotal")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary_row">
              <span>{t("cart.shipping")}</span>
              <span>{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</span>
            </div>

            {amountLeftForFreeShipping > 0 ? (
              <p className="free_shipping_hint">
                <FaTruckFast />{" "}
                {t("cart.freeShippingHint", {
                  amount: formatPrice(amountLeftForFreeShipping),
                })}
              </p>
            ) : (
              <p className="free_shipping_hint free_shipping_hint_active">
                <FaTruckFast /> {t("cart.freeShippingActive")}
              </p>
            )}

            <div className="summary_row summary_total">
              <span>{t("cart.total")}</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              type="button"
              className="btn btn_primary checkout_btn"
              onClick={handleCheckout}
            >
              {t("cart.checkout")}
            </button>

            <Link to="/" className="continue_shopping_link">
              {t("cart.continueShopping")}
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
