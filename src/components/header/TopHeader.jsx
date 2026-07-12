import { Link } from "react-router-dom";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Logo from "../../img/logo.png";
import "./header.css";

function TopHeader() {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div className="top_header">
      <div className="container">
        <Link className="logo" to="/">
          <img src={Logo} alt="Logo" />
        </Link>

        <form className="search_box">
          <input type="text" placeholder="Search products..." />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <div className="header_icons">
          <Link className="icon" to="/favoris" aria-label="Favoris">
            <FaRegHeart />
            <span className="count">{wishlistCount}</span>
          </Link>

          <Link className="icon" to="/cart" aria-label="Panier">
            <TiShoppingCart />
            <span className="count">{itemCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
