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
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaRegStarHalfStroke />
      </div>

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