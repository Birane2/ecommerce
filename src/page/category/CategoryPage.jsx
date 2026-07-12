import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Product from "../../components/slideProducts/Product";
import { getAllProducts, getProductsByCategory } from "../../services/productService";
import "./category.css";

// Transforme un slug ("mobile-accessories") en libellé lisible ("Mobile Accessories")
function formatCategoryName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function CategoryPage() {
  const { slug } = useParams();
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const data =
          slug === "all" ? await getAllProducts() : await getProductsByCategory(slug);

        if (isMounted) setProducts(data);
      } catch {
        if (isMounted) setError(t("category.error"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted = false;
    };
  }, [slug, t]);

  const title = slug === "all" ? t("category.allProductsTitle") : formatCategoryName(slug);

  return (
    <main className="category_page">
      <div className="container">
        <h1 className="category_title">{title}</h1>

        {isLoading && (
          <div className="category_grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="category_skeleton_card" key={index}>
                <div className="skeleton category_skeleton_image" />
                <div className="skeleton category_skeleton_line" />
                <div className="skeleton category_skeleton_line category_skeleton_line_short" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="category_state category_state_error">
            <p>{error}</p>
            <Link to="/" className="btn">
              {t("category.backToHome")}
            </Link>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="category_state">{t("category.empty")}</p>
        )}

        {!isLoading && !error && products.length > 0 && (
          <>
            <p className="category_count">
              {t("category.productsFound", { count: products.length })}
            </p>
            <div className="category_grid">
              {products.map((product) => (
                <Product item={product} key={product.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default CategoryPage;
