<<<<<<< HEAD
import { FaCartArrowDown, FaRegHeart, FaShare } from "react-icons/fa";
import { FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import "./slideProduct.css";

function Product({ item }) {
  if (!item) return null;

  return (
    <article className="product">
      <div className="img_product">
        <img src={item.thumbnail} alt={item.title} />
      </div>

      <h3 className="name_product">{item.title}</h3>

      <div className="stars" aria-label="Product rating">
=======
import React from "react";
import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { FaCartArrowDown, FaRegHeart, FaShare } from "react-icons/fa";
import "./slideProduct.css";

function Product({ product }) {
  const priceMRU = Math.round(product.price * 40);

  return (
    <div className="product">
      <div className="img_product">
        <img src={product.thumbnail} alt={product.title} />
      </div>

      <p className="name_product">{product.title}</p>

      <div className="stars">
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaRegStarHalfStroke />
      </div>

<<<<<<< HEAD
      <p className="price">{(item.price * 40).toLocaleString()} MRU</p>

      <div className="icons">
        <button type="button" aria-label="Add to cart">
          <FaCartArrowDown />
        </button>
        <button type="button" aria-label="Add to wishlist">
          <FaRegHeart />
        </button>
        <button type="button" aria-label="Share product">
          <FaShare />
        </button>
      </div>
    </article>
  );
}

export default Product;
=======
      <p className="price">
        {priceMRU.toLocaleString()} MRU
        <span> {Math.round(priceMRU * 1.15).toLocaleString()} MRU</span>
      </p>

      <div className="icons">
        <span><FaCartArrowDown /></span>
        <span><FaRegHeart /></span>
        <span><FaShare /></span>
      </div>
    </div>
  );
}

export default Product;
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
