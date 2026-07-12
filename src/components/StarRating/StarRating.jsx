import { useTranslation } from "react-i18next";
import { FaStar, FaRegStar, FaStarHalfStroke } from "react-icons/fa6";
import "./starRating.css";

// Arrondit la note à 0.5 près et affiche 5 icônes (pleine / demie / vide)
function StarRating({ rating = 0, size }) {
  const { t } = useTranslation();
  const rounded = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i += 1) {
    if (rounded >= i) stars.push(<FaStar key={i} />);
    else if (rounded + 0.5 === i) stars.push(<FaStarHalfStroke key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }

  return (
    <span
      className="star_rating"
      style={size ? { fontSize: size } : undefined}
      aria-label={t("product.ratingAria", { rating })}
    >
      {stars}
    </span>
  );
}

export default StarRating;
