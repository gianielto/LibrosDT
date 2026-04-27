import { useState } from "react";
import "./MasVendidos.css";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  sales: number;
  badge?: string;
};

// Datos de ejemplo
const bestSellers: Product[] = [
  {
    id: "1",
    title: "Producto Premium 1",
    price: 299.99,
    image: "https://via.placeholder.com/250x300?text=Producto+1",
    rating: 4.8,
    sales: 1250,
    badge: "TOP",
  },
  {
    id: "2",
    title: "Producto Premium 2",
    price: 199.99,
    image: "https://via.placeholder.com/250x300?text=Producto+2",
    rating: 4.7,
    sales: 980,
    badge: "TOP",
  },
  {
    id: "3",
    title: "Producto Popular 3",
    price: 149.99,
    image: "https://via.placeholder.com/250x300?text=Producto+3",
    rating: 4.6,
    sales: 750,
  },
  {
    id: "4",
    title: "Producto Popular 4",
    price: 179.99,
    image: "https://via.placeholder.com/250x300?text=Producto+4",
    rating: 4.5,
    sales: 620,
  },
  {
    id: "5",
    title: "Producto Premium 5",
    price: 349.99,
    image: "https://via.placeholder.com/250x300?text=Producto+5",
    rating: 4.9,
    sales: 1400,
    badge: "TOP",
  },
  {
    id: "6",
    title: "Producto Especial 6",
    price: 219.99,
    image: "https://via.placeholder.com/250x300?text=Producto+6",
    rating: 4.8,
    sales: 890,
  },
  {
    id: "7",
    title: "Producto Destacado 7",
    price: 189.99,
    image: "https://via.placeholder.com/250x300?text=Producto+7",
    rating: 4.7,
    sales: 710,
  },
  {
    id: "8",
    title: "Producto Exclusivo 8",
    price: 399.99,
    image: "https://via.placeholder.com/250x300?text=Producto+8",
    rating: 4.9,
    sales: 1100,
    badge: "TOP",
  },
];

export default function MasVendidos() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleProductClick = (productId: string) => {
    setSelectedProduct(productId);
    // Aquí puedes navegar a detalle del producto
    console.log("Ver producto:", productId);
  };

  return (
    <section className="mas-vendidos">
      <div className="mas-vendidos-header">
        <h1 className="mas-vendidos-title">Más Vendidos</h1>
        <p className="mas-vendidos-subtitle">
          Los productos más populares y recomendados
        </p>
      </div>

      <div className="products-grid">
        {bestSellers.map((product) => (
          <article
            key={product.id}
            className={`product-card ${
              selectedProduct === product.id ? "selected" : ""
            }`}
            onClick={() => handleProductClick(product.id)}
            role="button"
            tabIndex={0}
          >
            <div className="product-image-container">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}
              <div className="product-overlay">
                <button className="view-details-btn">Ver Detalles</button>
              </div>
            </div>

            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>

              <div className="product-rating">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`star ${
                        i < Math.floor(product.rating) ? "filled" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="rating-value">{product.rating}</span>
              </div>

              <div className="product-sales">
                <span className="sales-count">
                  {product.sales.toLocaleString()} vendidos
                </span>
              </div>

              <div className="product-footer">
                <span className="product-price">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  className="add-to-cart-btn"
                  aria-label="Añadir al carrito"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M9 2L6.17 6H3l1.35 2.45.5.89v8.11A2 2 0 0 0 6.5 20h11a2 2 0 0 0 2-2v-8l.5-.89L21 6h-3.17L15 2H9z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
