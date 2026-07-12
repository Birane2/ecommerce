import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
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
import { formatDate } from "../../utils/formatDate";
import ShareMenu from "../../components/ShareMenu/ShareMenu";
import StarRating from "../../components/StarRating/StarRating";
import "./productDetails.css";

const TAB_IDS = [
  { id: "description", labelKey: "product.tabDescription" },
  { id: "specs", labelKey: "product.tabSpecs" },
  { id: "reviews", labelKey: "product.tabReviews" },
];

function ProductDetails() {
  const { t } = useTranslation();
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
  const [activeTab, setActiveTab] = useState(TAB_IDS[0].id);
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
        setActiveTab(TAB_IDS[0].id);

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
          setError(t("product.loadError"));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <h2>{t("product.notFoundTitle")}</h2>
          <p>{error || t("product.notFoundText")}</p>
          <button type="button" className="btn" onClick={() => navigate("/")}>
            {t("product.backToHome")}
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
      showToast(t("product.toastMaxStock"), "error");
      return;
    }

    showToast(
      limitedByStock
        ? t("product.toastLimitedStock", { count: addedQuantity })
        : t("product.toastAddedToCart", { count: addedQuantity, title: product.title })
    );
  }

  function handleBuyNow() {
    if (isOutOfStock) return;

    const { addedQuantity } = addToCart(product, quantity);
    if (addedQuantity === 0) {
      showToast(t("product.toastMaxStock"), "error");
      return;
    }

    navigate("/cart");
  }

  function handleWishlistToggle() {
    const result = toggleWishlist(product);
    showToast(
      result === "added"
        ? t("product.toastAddedToWishlist")
        : t("product.toastRemovedFromWishlist")
    );
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
        <nav className="breadcrumb" aria-label={t("product.breadcrumbAria")}>
          <Link to="/">{t("product.home")}</Link>
          <FaChevronRight />
          <Link to={`/category/${product.category}`}>{categoryLabel}</Link>
          <FaChevronRight />
          <span>{product.title}</span>
        </nav>

        <section className="product_main">
          <div className="gallery">
            <div className="badges">
              {isNew && <span className="badge badge_new">{t("product.badgeNew")}</span>}
              {isPromotion && (
                <span className="badge badge_promo">-{pricing.discount}%</span>
              )}
              {isOutOfStock && (
                <span className="badge badge_out">{t("product.outOfStockBadge")}</span>
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
                  aria-label={t("product.viewImage", {
                    index: index + 1,
                    title: product.title,
                  })}
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
              <StarRating rating={product.rating} />
              <span className="rating_value">{product.rating?.toFixed(1)}</span>
              <span className="review_count">
                {t("product.reviewsCount", { count: product.reviews?.length || 0 })}
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
                  ? t("product.outOfStock")
                  : isLowStock
                  ? t("product.lowStock", { count: product.stock })
                  : t("product.inStock", { count: product.stock })}
              </span>
            </div>

            <p className="short_description">{product.description}</p>

            <div className="purchase_row">
              <div className="quantity_selector">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isOutOfStock || quantity <= 1}
                  aria-label={t("product.decreaseQuantity")}
                >
                  <FaMinus />
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isOutOfStock || quantity >= product.stock}
                  aria-label={t("product.increaseQuantity")}
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
                {t("product.addToCart")}
              </button>

              <button
                type="button"
                className="btn btn_primary"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <FaBoltLightning /> {t("product.buyNow")}
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
                {t("product.favorites")}
              </button>

              <ShareMenu title={product.title} text={product.description} />
            </div>

            <div className="trust_badges">
              <div className="trust_item">
                <FaTruckFast />
                <span>{t("product.fastShipping")}</span>
              </div>
              <div className="trust_item">
                <FaRotateLeft />
                <span>{t("product.freeReturns")}</span>
              </div>
              <div className="trust_item">
                <FaLock />
                <span>{t("product.securePayment")}</span>
              </div>
              <div className="trust_item">
                <FaShieldHalved />
                <span>{t("product.warranty")}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="product_tabs">
          <div className="tab_list" role="tablist" aria-label={t("product.tabsAria")}>
            {TAB_IDS.map((tab) => (
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
                {t(tab.labelKey)}
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
                    <th>{t("product.specBrand")}</th>
                    <td>{product.brand || "—"}</td>
                  </tr>
                  <tr>
                    <th>{t("product.specCategory")}</th>
                    <td>{categoryLabel || "—"}</td>
                  </tr>
                  <tr>
                    <th>{t("product.specSku")}</th>
                    <td>{product.sku || "—"}</td>
                  </tr>
                  <tr>
                    <th>{t("product.specWeight")}</th>
                    <td>{product.weight ? `${product.weight} g` : "—"}</td>
                  </tr>
                  <tr>
                    <th>{t("product.specDimensions")}</th>
                    <td>
                      {product.dimensions
                        ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("product.specWarranty")}</th>
                    <td>{product.warrantyInformation || "—"}</td>
                  </tr>
                  <tr>
                    <th>{t("product.specShipping")}</th>
                    <td>{product.shippingInformation || "—"}</td>
                  </tr>
                  <tr>
                    <th>{t("product.specReturnPolicy")}</th>
                    <td>{product.returnPolicy || "—"}</td>
                  </tr>
                  <tr>
                    <th>{t("product.specMinQuantity")}</th>
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
                        <StarRating rating={review.rating} />
                        <p className="review_comment">{review.comment}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p>{t("product.noReviews")}</p>
              )}
            </div>
          )}
        </section>

        {relatedProducts.length > 0 && (
          <section className="related_products">
            <h2>{t("product.relatedProducts")}</h2>
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
      <StarRating rating={item.rating} />
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
