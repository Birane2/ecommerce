import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function HeroSlider() {
  const { t } = useTranslation();

  const slides = [
    { image: "/src/img/banner_Hero1.jpg", alt: "slider hero 1" },
    { image: "/src/img/banner_Hero2.jpg", alt: "slider hero 2" },
    { image: "/src/img/banner_Hero3.jpg", alt: "slider hero 3" },
  ];

  return (
    <div className="hero">
      <div className="container">
        <Swiper
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={true}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.image}>
              <div className="content">
                <h4>{t("hero.introducing")}</h4>
                <h3>{t("hero.title")}</h3>
                <p>{t("hero.subtitle")}</p>
                <Link to="/" className="btn">
                  {t("hero.shopNow")}
                </Link>
              </div>
              <img src={slide.image} alt={slide.alt} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default HeroSlider;
