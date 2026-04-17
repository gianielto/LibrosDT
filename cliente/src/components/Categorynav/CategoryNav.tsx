import { useState } from "react";
import "./CategoryNav.css";
import { useNavigate } from "react-router-dom";

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const categories: Category[] = [
  {
    id: "MasVendidos",
    label: "Más Vendidos",
    icon: (
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cat-icon"
      >
        <circle
          cx="28"
          cy="22"
          r="14"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M28 8V22L35 15"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 36L14 50M38 36L42 50M14 50H42"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M20 40H36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="28" cy="22" r="4" fill="currentColor" opacity="0.15" />
        <path
          d="M24 22L27 25L32 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "novedades",
    label: "Novedades",
    icon: (
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cat-icon"
      >
        <rect
          x="10"
          y="14"
          width="28"
          height="36"
          rx="3"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <rect
          x="16"
          y="8"
          width="28"
          height="36"
          rx="3"
          fill="var(--cat-bg)"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M22 18H38M22 24H38M22 30H32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="42" cy="14" r="7" fill="var(--cat-accent)" />
        <path
          d="M42 10V14L45 16"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "frases",
    label: "Frases",
    icon: (
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cat-icon"
      >
        <path
          d="M10 16C10 14.3 11.3 13 13 13H38C39.7 13 41 14.3 41 16V34C41 35.7 39.7 37 38 37H30L24 44V37H13C11.3 37 10 35.7 10 34V16Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M18 22Q18 20 20 20Q22 20 22 22Q22 24 20 25V28H18V25Q16 24 18 22Z"
          fill="currentColor"
          opacity="0.7"
        />
        <path
          d="M26 22Q26 20 28 20Q30 20 30 22Q30 24 28 25V28H26V25Q24 24 26 22Z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    id: "generos",
    label: "Géneros",
    icon: (
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cat-icon"
      >
        <rect
          x="8"
          y="32"
          width="10"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <rect
          x="23"
          y="22"
          width="10"
          height="26"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <rect
          x="38"
          y="14"
          width="10"
          height="34"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <rect
          x="8"
          y="32"
          width="10"
          height="16"
          rx="2"
          fill="currentColor"
          opacity="0.12"
        />
        <rect
          x="23"
          y="22"
          width="10"
          height="26"
          rx="2"
          fill="currentColor"
          opacity="0.12"
        />
        <rect
          x="38"
          y="14"
          width="10"
          height="34"
          rx="2"
          fill="var(--cat-accent)"
          opacity="0.25"
        />
        <path
          d="M12 28L25 20L38 12"
          stroke="var(--cat-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 0"
        />
        <circle cx="38" cy="12" r="3" fill="var(--cat-accent)" />
      </svg>
    ),
  },
];
//
export default function CategoryNav() {
  const [active, setActive] = useState("MasVendidos");
  const navigate = useNavigate();
  const handleClick = (catId: string) => {
    setActive(catId);
    navigate(`/${catId}`);
  };
  return (
    <nav className="cat-nav" aria-label="Categorías">
      <ul className="cat-list" role="list">
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              className={`cat-item${active === cat.id ? " cat-item--active" : ""}`}
              onClick={() => handleClick(cat.id)}
              aria-pressed={active === cat.id}
            >
              <span className="cat-icon-wrap">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
