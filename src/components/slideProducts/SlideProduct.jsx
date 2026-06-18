import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Product from "./Product";

import "swiper/css";
import "swiper/css/navigation";
import "./slideProduct.css";

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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default SlideProduct;