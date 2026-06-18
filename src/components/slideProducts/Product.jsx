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
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaRegStarHalfStroke />
      </div>

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
