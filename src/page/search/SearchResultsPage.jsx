import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Product from "../../components/slideProducts/Product";
import { searchProducts } from "../../services/productService";
import "./search.css";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { t } = useTranslation();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function runSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const data = await searchProducts(query);
        if (isMounted) setResults(data);
      } catch {
        if (isMounted) setError(t("search.error"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    runSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted = false;
    };
  }, [query, t]);

  return (
    <main className="search_page">
      <div className="container">
        {query.trim() && (
          <h1 className="search_title">{t("search.resultsTitle", { query })}</h1>
        )}

        {!query.trim() && (
          <div className="search_state">
            <FaMagnifyingGlass className="search_state_icon" />
            <p>{t("search.prompt")}</p>
          </div>
        )}

        {isLoading && (
          <div className="search_grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="search_skeleton_card" key={index}>
                <div className="skeleton search_skeleton_image" />
                <div className="skeleton search_skeleton_line" />
                <div className="skeleton search_skeleton_line search_skeleton_line_short" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && <p className="search_state search_state_error">{error}</p>}

        {!isLoading && !error && query.trim() && results.length === 0 && (
          <div className="search_state">
            <FaMagnifyingGlass className="search_state_icon" />
            <p className="search_state_title">{t("search.noResults")}</p>
            <p>{t("search.noResultsHint")}</p>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <>
            <p className="search_count">
              {t("search.productsFound", { count: results.length })}
            </p>
            <div className="search_grid">
              {results.map((product) => (
                <Product item={product} key={product.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default SearchResultsPage;
