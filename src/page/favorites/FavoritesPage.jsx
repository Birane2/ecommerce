import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";
import "./favorites.css";

function FavoritesPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  function handleRemove(item) {
    removeFromWishlist(item.id);
    showToast(`"${item.title}" retiré des favoris`, "info");
  }

  if (wishlistItems.length === 0) {
    return (
      <main className="favorites_page">
        <div className="container empty_favorites">
          <FaRegHeart className="empty_favorites_icon" />
          <h2>Aucun favori pour le moment</h2>
          <p>Ajoutez des produits à vos favoris pour les retrouver ici.</p>
          <Link to="/" className="btn btn_primary">
            Découvrir nos produits
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites_page">
      <div className="container">
        <h1 className="favorites_title">Mes favoris ({wishlistItems.length})</h1>

        <div className="favorites_grid">
          {wishlistItems.map((item) => (
            <article className="favorite_card" key={item.id}>
              <button
                type="button"
                className="favorite_remove"
                onClick={() => handleRemove(item)}
                aria-label={`Retirer ${item.title} des favoris`}
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
