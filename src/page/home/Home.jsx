<<<<<<< HEAD
import { useEffect, useState } from "react";
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
          setError("Impossible de charger les produits");
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
  }, []);

  if (isLoading) {
    return (
      <main>
        <HeroSlider />
        <div className="products_status">Loading...</div>
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
      <SlideProduct title="Smartphones" data={smartphones} />
      <SlideProduct title="Mobile Accessories" data={mobileAccessories} />
      <SlideProduct title="Laptops" data={laptops} />
      <SlideProduct title="Tablets" data={tablets} />
      <SlideProduct title="Sunglasses" data={sunglasses} />
      <SlideProduct title="Sports Accessories" data={sportsAccessories} />
    </main>
  );
}

export default Home;
=======
import React from "react";
import HeroSlider from "../../components/HeroSlider";
import SlideProduct from "../../components/slideProducts/SlideProduct";
import "./home.css";

function Home() {
  return (
    <>
      <HeroSlider />
      <SlideProduct />
    </>
  );
}

export default Home;
>>>>>>> 78f07469dfdda993ec884102e3fca5fabe099a49
