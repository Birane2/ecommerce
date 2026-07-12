import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaRegHeart,
  FaHeart,
  FaMinus,
  FaPlus,
  FaBoltLightning,
  FaCartShopping,
  FaTruckFast,
  FaRotateLeft,
  FaShieldHalved,
  FaLock,
  FaChevronRight,
  FaCircleCheck,
  FaCircleXmark,
  FaStarHalfStroke,
  FaSpinner,
} from "react-icons/fa6";
import {
  getProductById,
  getProductsByCategory,
} from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";
import ShareMenu from "../../components/ShareMenu/ShareMenu";
import "./productDetails.css";

const TABS = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Caractéristiques" },
  { id: "reviews", label: "Avis clients" },
];

// Arrondit la note à 0.5 près et retourne 5 icônes (pleine / demie / vide)
function renderStars(rating = 0) {
  const rounded = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i += 1) {
    if (rounded >= i) stars.push(<FaStar key={i} />);
    else if (rounded + 0.5 === i) stars.push(<FaStarHalfStroke key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }

  return stars;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [zoomStyle, setZoomStyle] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProductById(id);
        if (!isMounted) return;

        setProduct(data);
        setActiveImage(0);
        setQuantity(1);
        setActiveTab(TABS[0].id);

        const createdAt = data.meta?.createdAt;
        const ageInDays = createdAt
          ? (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
          : Infinity;
        setIsNew(ageInDays <= 60);

        const sameCategory = await getProductsByCategory(data.category);
        if (!isMounted) return;
        setRelatedProducts(
          sameCategory.filter((item) => item.id !== data.id).slice(0, 4)
        );
      } catch {
        if (isMounted) {
          setError("Ce produit est introuvable ou une erreur est survenue.");
          setProduct(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const pricing = useMemo(() => {
    if (!product) return null;
    const discount = product.discountPercentage || 0;
    const current = product.price;
    const original = discount > 0 ? current / (1 - discount / 100) : current;
    return { current, original, discount: Math.round(discount) };
  }, [product]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <main className="product_details_page">
        <div className="container state_box state_error">
          <h2>Produit introuvable</h2>
          <p>{error || "Ce produit n'existe pas ou a été retiré."}</p>
          <button type="button" className="btn" onClick={() => navigate("/")}>
            Retour à l&apos;accueil
          </button>
        </div>
      </main>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const isOutOfStock =
    product.stock === 0 || product.availabilityStatus === "Out of Stock";
  const isLowStock = !isOutOfStock && product.stock > 0 && product.stock <= 10;
  const isPromotion = pricing.discount > 0;

  function handleQuantityChange(delta) {
    setQuantity((prev) => {
      const next = prev + delta;
      const max = product.stock || 1;
      return Math.min(Math.max(next, 1), max);
    });
  }

  function handleAddToCart() {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    window.setTimeout(() => setIsAdding(false), 500);

    const { addedQuantity, limitedByStock } = addToCart(product, quantity);

    if (addedQuantity === 0) {
      showToast("Stock maximum déjà présent dans votre panier", "error");
      return;
    }

    showToast(
      limitedByStock
        ? `Seulement ${addedQuantity} exemplaire(s) ajouté(s) (stock limité)`
        : `${addedQuantity} × "${product.title}" ajouté au panier`
    );
  }

  function handleBuyNow() {
    if (isOutOfStock) return;

    const { addedQuantity } = addToCart(product, quantity);
    if (addedQuantity === 0) {
      showToast("Stock maximum déjà présent dans votre panier", "error");
      return;
    }

    navigate("/cart");
  }

  function handleWishlistToggle() {
    const result = toggleWishlist(product);
    showToast(result === "added" ? "Ajouté aux favoris" : "Retiré des favoris");
  }

  function handleZoomMove(event) {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(1.9)" });
  }

  const categoryLabel = product.category?.replace(/-/g, " ") || "";

  return (
    <main className="product_details_page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <FaChevronRight />
          <Link to={`/category/${product.category}`}>{categoryLabel}</Link>
          <FaChevronRight />
          <span>{product.title}</span>
        </nav>

        <section className="product_main">
          <div className="gallery">
            <div className="badges">
              {isNew && <span className="badge badge_new">Nouveau</span>}
              {isPromotion && (
                <span className="badge badge_promo">-{pricing.discount}%</span>
              )}
              {isOutOfStock && (
                <span className="badge badge_out">Rupture de stock</span>
              )}
            </div>

            <div
              className="main_image_frame"
              onMouseMove={handleZoomMove}
              onMouseLeave={() => setZoomStyle(null)}
            >
              <img
                src={images[activeImage]}
                alt={product.title}
                className="main_image"
                style={zoomStyle || undefined}
              />
            </div>

            <div className="thumbnails" role="list">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image + index}
                  role="listitem"
                  className={`thumb ${index === activeImage ? "active" : ""}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Voir l'image ${index + 1} de ${product.title}`}
                  aria-pressed={index === activeImage}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="info_panel">
            {product.brand && <p className="brand">{product.brand}</p>}
            <h1 className="title">{product.title}</h1>

            <div className="rating_row">
              <span className="stars" aria-hidden="true">
                {renderStars(product.rating)}
              </span>
              <span className="rating_value">{product.rating?.toFixed(1)}</span>
              <span className="review_count">
                ({product.reviews?.length || 0} avis)
              </span>
            </div>

            <div className="price_row">
              <span className="current_price">{formatPrice(pricing.current)}</span>
              {isPromotion && (
                <span className="old_price">{formatPrice(pricing.original)}</span>
              )}
              {isPromotion && (
                <span className="discount_pill">-{pricing.discount}%</span>
              )}
            </div>

            <div
              className={`stock_row ${isOutOfStock ? "out" : isLowStock ? "low" : "in"}`}
            >
              {isOutOfStock ? <FaCircleXmark /> : <FaCircleCheck />}
              <span>
                {isOutOfStock
                  ? "Rupture de stock"
                  : isLowStock
                  ? `Plus que ${product.stock} en stock !`
                  : `En stock (${product.stock} disponibles)`}
              </span>
            </div>

            <p className="short_description">{product.description}</p>

            <div className="purchase_row">
              <div className="quantity_selector">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isOutOfStock || quantity <= 1}
                  aria-label="Diminuer la quantité"
                >
                  <FaMinus />
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isOutOfStock || quantity >= product.stock}
                  aria-label="Augmenter la quantité"
                >
                  <FaPlus />
                </button>
              </div>

              <button
                type="button"
                className="btn btn_outline"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
              >
                {isAdding ? <FaSpinner className="spin_icon" /> : <FaCartShopping />}
                Ajouter au panier
              </button>

              <button
                type="button"
                className="btn btn_primary"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <FaBoltLightning /> Acheter maintenant
              </button>
            </div>

            <div className="secondary_actions">
              <button
                type="button"
                className={`icon_btn ${isWishlisted(product.id) ? "active" : ""}`}
                onClick={handleWishlistToggle}
                aria-pressed={isWishlisted(product.id)}
              >
                {isWishlisted(product.id) ? <FaHeart /> : <FaRegHeart />}
                Favoris
              </button>

              <ShareMenu title={product.title} text={product.description} />
            </div>

            <div className="trust_badges">
              <div className="trust_item">
                <FaTruckFast />
                <span>Livraison rapide</span>
              </div>
              <div className="trust_item">
                <FaRotateLeft />
                <span>Retour gratuit</span>
              </div>
              <div className="trust_item">
                <FaLock />
                <span>Paiement sécurisé</span>
              </div>
              <div className="trust_item">
                <FaShieldHalved />
                <span>Garantie incluse</span>
              </div>
            </div>
          </div>
        </section>

        <section className="product_tabs">
          <div className="tab_list" role="tablist" aria-label="Détails du produit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab_${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel_${tab.id}`}
                className={`tab_btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div
              id="panel_description"
              role="tabpanel"
              aria-labelledby="tab_description"
              className="tab_panel"
            >
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div
              id="panel_specs"
              role="tabpanel"
              aria-labelledby="tab_specs"
              className="tab_panel"
            >
              <table className="specs_table">
                <tbody>
                  <tr>
                    <th>Marque</th>
                    <td>{product.brand || "—"}</td>
                  </tr>
                  <tr>
                    <th>Catégorie</th>
                    <td>{categoryLabel || "—"}</td>
                  </tr>
                  <tr>
                    <th>SKU</th>
                    <td>{product.sku || "—"}</td>
                  </tr>
                  <tr>
                    <th>Poids</th>
                    <td>{product.weight ? `${product.weight} g` : "—"}</td>
                  </tr>
                  <tr>
                    <th>Dimensions</th>
                    <td>
                      {product.dimensions
                        ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <th>Garantie</th>
                    <td>{product.warrantyInformation || "—"}</td>
                  </tr>
                  <tr>
                    <th>Livraison</th>
                    <td>{product.shippingInformation || "—"}</td>
                  </tr>
                  <tr>
                    <th>Politique de retour</th>
                    <td>{product.returnPolicy || "—"}</td>
                  </tr>
                  <tr>
                    <th>Quantité minimum</th>
                    <td>{product.minimumOrderQuantity || 1}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div
              id="panel_reviews"
              role="tabpanel"
              aria-labelledby="tab_reviews"
              className="tab_panel"
            >
              {product.reviews?.length ? (
                <div className="reviews_list">
                  {product.reviews.map((review, index) => (
                    <article
                      className="review_card"
                      key={`${review.reviewerEmail}-${review.date}-${index}`}
                    >
                      <img
                        className="reviewer_avatar"
                        src={`https://i.pravatar.cc/100?u=${encodeURIComponent(
                          review.reviewerEmail || review.reviewerName
                        )}`}
                        alt=""
                        loading="lazy"
                      />
                      <div className="review_body">
                        <div className="review_header">
                          <span className="reviewer_name">
                            {review.reviewerName}
                          </span>
                          <span className="review_date">
                            {formatDate(review.date)}
                          </span>
                        </div>
                        <span className="stars" aria-hidden="true">
                          {renderStars(review.rating)}
                        </span>
                        <p className="review_comment">{review.comment}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p>Aucun avis pour ce produit pour le moment.</p>
              )}
            </div>
          )}
        </section>

        {relatedProducts.length > 0 && (
          <section className="related_products">
            <h2>Produits similaires</h2>
            <div className="related_grid">
              {relatedProducts.map((item) => (
                <RelatedProductCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function RelatedProductCard({ item }) {
  const discount = Math.round(item.discountPercentage || 0);

  return (
    <Link to={`/product/${item.id}`} className="related_card">
      {discount > 0 && <span className="related_badge">-{discount}%</span>}
      <div className="related_image">
        <img src={item.thumbnail} alt={item.title} loading="lazy" />
      </div>
      <h3>{item.title}</h3>
      <span className="stars" aria-hidden="true">
        {renderStars(item.rating)}
      </span>
      <p className="related_price">{formatPrice(item.price)}</p>
    </Link>
  );
}

function ProductDetailsSkeleton() {
  return (
    <main className="product_details_page">
      <div className="container">
        <div className="skeleton skeleton_breadcrumb" />
        <section className="product_main">
          <div className="gallery">
            <div className="skeleton skeleton_main_image" />
            <div className="thumbnails">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="skeleton skeleton_thumb" key={index} />
              ))}
            </div>
          </div>
          <div className="info_panel">
            <div className="skeleton skeleton_line skeleton_w40" />
            <div className="skeleton skeleton_line skeleton_w80" />
            <div className="skeleton skeleton_line skeleton_w60" />
            <div className="skeleton skeleton_line skeleton_w50" />
            <div className="skeleton skeleton_block" />
            <div className="skeleton skeleton_line skeleton_w70" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;
