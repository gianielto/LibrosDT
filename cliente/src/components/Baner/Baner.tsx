import { useEffect, useState } from "react";
import "./Banner.css";

const Baner: React.FC = () => {
  const [banners, setBanners] = useState<string[]>([]);
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("http://localhost:4001/Promociones");
        const data = await res.json();
        const randomFive = data.sort(() => Math.random() - 0.4).slice(0, 4);

        const bannerUrls = randomFive.map(
          (promocion: { archivo: string }) =>
            `../../../imagenes/promociones/archivos/${promocion.archivo}`
        );
        setBanners(bannerUrls);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="slider-frame">
      <ul>
        {/* <li><img src="../administrador/promociones/archivos/4a0a7c2cc364f505fae77301969c7031.png" alt=""></li><li><img src="../administrador/promociones/archivos/bb3c3d7ce6015ffe58cc02f7bb770861.png" alt=""></li><li><img src="../administrador/promociones/archivos/ec3b08757f8d4bc590b69dab3ae8f25e.png" alt=""></li><li><img src="../administrador/promociones/archivos/2e0e5f197f955242a127200c643c6656.jpeg" alt=""></li>             */}
        {banners.map((url, index) => (
          <li key={index}>
            <img src={url} alt={`banner-${index}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Baner;
