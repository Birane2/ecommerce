<<<<<<< HEAD
=======
import React from "react";
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
import { Link } from "react-router-dom";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import Logo from "../../img/logo.png";
import "./header.css";

function TopHeader() {
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
          <div className="icon">
            <FaRegHeart />
            <span className="count">0</span>
          </div>

          <div className="icon">
            <TiShoppingCart />
            <span className="count">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default TopHeader;
=======
export default TopHeader;
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
