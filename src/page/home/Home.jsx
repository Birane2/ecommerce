import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeroSlider from "../../components/HeroSlider";
import SlideProduct from "../../components/slideProducts/SlideProduct";
import {
  getLaptops,
  getMobileAccessories,
  getSmartphones,
  getSportsAccessories,
  getSunglasses,
  getTablets,
} from "../../services/productService";
import "./home.css";

function Home() {
  const { t } = useTranslation();
  const [smartphones, setSmartphones] = useState([]);
  const [mobileAccessories, setMobileAccessories] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [sunglasses, setSunglasses] = useState([]);
  const [sportsAccessories, setSportsAccessories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError("");

        const [
          smartphonesData,
          mobileAccessoriesData,
          laptopsData,
          tabletsData,
          sunglassesData,
          sportsAccessoriesData,
        ] = await Promise.all([
          getSmartphones(),
          getMobileAccessories(),
          getLaptops(),
          getTablets(),
          getSunglasses(),
          getSportsAccessories(),
        ]);

        if (!isMounted) return;

        setSmartphones(smartphonesData);
        setMobileAccessories(mobileAccessoriesData);
        setLaptops(laptopsData);
        setTablets(tabletsData);
        setSunglasses(sunglassesData);
        setSportsAccessories(sportsAccessoriesData);
      } catch {
        if (isMounted) {
          setError(t("home.error"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [t]);

  if (isLoading) {
    return (
      <main>
        <HeroSlider />
        <div className="products_status">{t("home.loading")}</div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <HeroSlider />
        <div className="products_status products_status_error">{error}</div>
      </main>
    );
  }

  return (
    <main>
      <HeroSlider />
      <SlideProduct title={t("home.sections.smartphones")} data={smartphones} />
      <SlideProduct
        title={t("home.sections.mobile-accessories")}
        data={mobileAccessories}
      />
      <SlideProduct title={t("home.sections.laptops")} data={laptops} />
      <SlideProduct title={t("home.sections.tablets")} data={tablets} />
      <SlideProduct title={t("home.sections.sunglasses")} data={sunglasses} />
      <SlideProduct
        title={t("home.sections.sports-accessories")}
        data={sportsAccessories}
      />
    </main>
  );
}

export default Home;
