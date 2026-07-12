import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoMenu } from "react-icons/io5";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { PiSignInBold } from "react-icons/pi";
import { FaUserPlus } from "react-icons/fa6";
import { getCategories } from "../../services/productService";
import "./header.css";

function BtmHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryNavRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        setCategoriesError("");
        const data = await getCategories();
        if (isMounted) setCategories(data);
      } catch {
        if (isMounted) setCategoriesError(t("nav.categoriesError"));
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [t]);

  // Ferme le menu déroulant au clic extérieur
  useEffect(() => {
    if (!isCategoryOpen) return undefined;

    function handleOutsideClick(event) {
      if (categoryNavRef.current && !categoryNavRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isCategoryOpen]);

  const NavLinks = [{ title: t("nav.home"), link: "/" }];

  return (
    <div className="btm_header">
      <div className="container">
        <nav className="nav">
          <div className="category_nav" ref={categoryNavRef}>
            <div
              className="category_btn"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-haspopup="menu"
              aria-expanded={isCategoryOpen}
            >
              <IoMenu />
              <p>{t("nav.browseCategories")}</p>
              <MdOutlineArrowDropDown />
            </div>

            <div
              className={`category_nav_list ${isCategoryOpen ? "active" : ""}`}
              role="menu"
            >
              <Link
                to="/category/all"
                onClick={() => setIsCategoryOpen(false)}
                className="category_all_link"
              >
                {t("nav.allProducts")}
              </Link>

              {isLoadingCategories && (
                <p className="category_status">{t("nav.loadingCategories")}</p>
              )}

              {!isLoadingCategories && categoriesError && (
                <p className="category_status category_status_error">{categoriesError}</p>
              )}

              {!isLoadingCategories &&
                !categoriesError &&
                categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
            </div>
          </div>

          <ul className="nav_links">
            {NavLinks.map((item) => (
              <li
                key={item.title}
                className={location.pathname === item.link ? "active" : ""}
              >
                <Link to={item.link}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sign_regs_icon">
          <Link to="/login">
            <PiSignInBold />
          </Link>

          <Link to="/register">
            <FaUserPlus />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BtmHeader;
