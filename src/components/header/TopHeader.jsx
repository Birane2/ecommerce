import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass, FaRegHeart, FaXmark } from "react-icons/fa6";
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useDebounce } from "../../hooks/useDebounce";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import Logo from "../../img/logo.png";
import "./header.css";

function TopHeader() {
  const { t } = useTranslation();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Reste synchronisé avec ?q= quand on est déjà sur la page de résultats
  const [searchTerm, setSearchTerm] = useState(
    location.pathname === "/search" ? searchParams.get("q") || "" : ""
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim();
    if (!trimmed) return;

    const nextUrl = `/search?q=${encodeURIComponent(trimmed)}`;
    navigate(nextUrl, { replace: location.pathname === "/search" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  function handleClear() {
    setSearchTerm("");
    if (location.pathname === "/search") {
      navigate("/");
    }
  }

  return (
    <div className="top_header">
      <div className="container">
        <Link className="logo" to="/">
          <img src={Logo} alt="Logo" />
        </Link>

        <form className="search_box" onSubmit={handleSubmit} role="search">
          <input
            type="text"
            placeholder={t("nav.searchPlaceholder")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label={t("nav.searchAria")}
          />
          {searchTerm && (
            <button
              type="button"
              className="search_clear"
              onClick={handleClear}
              aria-label={t("nav.clearSearch")}
            >
              <FaXmark />
            </button>
          )}
          <button type="submit" aria-label={t("nav.searchAria")}>
            <FaMagnifyingGlass />
          </button>
        </form>

        <div className="header_icons">
          <LanguageSwitcher />

          <Link className="icon" to="/favoris" aria-label={t("nav.favorites")}>
            <FaRegHeart />
            <span className="count">{wishlistCount}</span>
          </Link>

          <Link className="icon" to="/cart" aria-label={t("nav.cart")}>
            <TiShoppingCart />
            <span className="count">{itemCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
