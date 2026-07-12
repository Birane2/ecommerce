import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Product from "./Product";

import "swiper/css";
import "swiper/css/navigation";
import "./slideProduct.css";

function SlideProduct({ title, data = [] }) {
  const { t } = useTranslation();

  return (
    <section className="slide_products">
      <div className="container">
        <div className="top_slide">
          <h2>{title}</h2>
          <p className="subtitle">{t("home.sectionSubtitle")}</p>
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default SlideProduct;
