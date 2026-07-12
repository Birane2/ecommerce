import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCartArrowDown, FaRegHeart, FaHeart, FaShare } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import StarRating from "../StarRating/StarRating";
import "./slideProduct.css";

function Product({ item }) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  if (!item) return null;

  const isOutOfStock = item.stock === 0;

  function handleAddToCart() {
    if (isOutOfStock) return;
    const { addedQuantity, limitedByStock } = addToCart(item, 1);
    if (addedQuantity === 0) {
      showToast(t("product.toastMaxStock"), "error");
      return;
    }
    showToast(
      limitedByStock
        ? t("product.toastLimitedStock", { count: addedQuantity })
        : t("product.toastAddedToCart", { count: addedQuantity, title: item.title })
    );
  }

  function handleWishlistToggle() {
    const result = toggleWishlist(item);
    showToast(
      result === "added"
        ? t("product.toastAddedToWishlist")
        : t("product.toastRemovedFromWishlist")
    );
  }

  // Carte compacte (overflow: hidden) : pas de place pour le menu déroulant
  // complet, on utilise donc directement l'API native ou la copie du lien.
  async function handleShare() {
    const shareUrl = `${window.location.origin}/product/${item.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, url: shareUrl });
      } catch (error) {
        if (error?.name !== "AbortError") {
          showToast(t("share.toastShareError"), "error");
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(t("share.toastCopied"));
    } catch {
      showToast(t("share.toastCopyError"), "error");
    }
  }

  return (
    <article className="product">
      <Link to={`/product/${item.id}`} className="product_link">
        <div className="img_product">
          <img src={item.thumbnail} alt={item.title} loading="lazy" />
        </div>

        <h3 className="name_product">{item.title}</h3>
      </Link>

      <div className="stars">
        <StarRating rating={item.rating} />
      </div>

      <p className="price">{(item.price * 40).toLocaleString()} MRU</p>

      <div className="icons">
        <button
          type="button"
          aria-label={t("productCard.addToCart")}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <FaCartArrowDown />
        </button>
        <button
          type="button"
          aria-label={t("productCard.addToWishlist")}
          aria-pressed={isWishlisted(item.id)}
          onClick={handleWishlistToggle}
        >
          {isWishlisted(item.id) ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button
          type="button"
          aria-label={t("productCard.shareProduct")}
          onClick={handleShare}
        >
          <FaShare />
        </button>
      </div>
    </article>
  );
}

export default Product;
