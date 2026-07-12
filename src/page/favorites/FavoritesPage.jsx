import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";
import "./favorites.css";

function FavoritesPage() {
  const { t } = useTranslation();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  function handleRemove(item) {
    removeFromWishlist(item.id);
    showToast(t("favorites.toastRemoved", { title: item.title }), "info");
  }

  if (wishlistItems.length === 0) {
    return (
      <main className="favorites_page">
        <div className="container empty_favorites">
          <FaRegHeart className="empty_favorites_icon" />
          <h2>{t("favorites.emptyTitle")}</h2>
          <p>{t("favorites.emptyText")}</p>
          <Link to="/" className="btn btn_primary">
            {t("favorites.discoverProducts")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites_page">
      <div className="container">
        <h1 className="favorites_title">
          {t("favorites.title", { count: wishlistItems.length })}
        </h1>

        <div className="favorites_grid">
          {wishlistItems.map((item) => (
            <article className="favorite_card" key={item.id}>
              <button
                type="button"
                className="favorite_remove"
                onClick={() => handleRemove(item)}
                aria-label={t("favorites.removeItem", { title: item.title })}
              >
                <FaHeart />
              </button>

              <Link to={`/product/${item.id}`} className="favorite_image">
                <img src={item.thumbnail} alt={item.title} loading="lazy" />
              </Link>

              <Link to={`/product/${item.id}`} className="favorite_title">
                {item.title}
              </Link>

              <p className="favorite_price">{formatPrice(item.price)}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default FavoritesPage;
