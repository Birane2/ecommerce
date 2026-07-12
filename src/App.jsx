import { Routes, Route } from "react-router-dom";
import TopHeader from "./components/header/TopHeader";
import BtmHeader from "./components/header/BtmHeader";
import Home from "./page/home/Home";
import ProductDetails from "./page/productDetails/ProductDetails";
import CartPage from "./page/cart/CartPage";
import FavoritesPage from "./page/favorites/FavoritesPage";

function App() {
  return (
    <>
      <TopHeader />
      <BtmHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favoris" element={<FavoritesPage />} />
      </Routes>
    </>
  );
}

export default App;