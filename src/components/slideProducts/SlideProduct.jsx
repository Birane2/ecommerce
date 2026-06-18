<<<<<<< HEAD
=======
import React, { useEffect, useState } from "react";
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Product from "./Product";

import "swiper/css";
import "swiper/css/navigation";
import "./slideProduct.css";

<<<<<<< HEAD
function SlideProduct({ title, data = [] }) {
  return (
    <section className="slide_products">
      <div className="container">
        <div className="top_slide">
          <h2>{title}</h2>
          <p className="subtitle">Add bestselling products to weekly line up</p>
        </div>

        <Swiper
          slidesPerView={5}
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          watchOverflow={true}
          grabCursor={true}
          className="products_slider"
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 5 },
          }}
        >
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <Product item={item} />
=======
function SlideProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products/category/smartphones")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((error) => console.log(error));
  }, []);

  return (
    <section className="top_slide">
      <div className="container">
        <h2>smartphones</h2>
        <p className="subtitle">Add bestselling products to weekly line up</p>

        <Swiper
          navigation={true}
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          className="products_slider"
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Product product={product} />
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

<<<<<<< HEAD
export default SlideProduct;
=======
export default SlideProduct;
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
