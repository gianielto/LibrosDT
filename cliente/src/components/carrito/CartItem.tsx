// CartItem.tsx
import { useState } from "react";
import "./CartItem.css";
// import MensajeError from "../ui/mensajeError/mensajeError";
import Btn2 from "../ui/Btn2/Btn2";
import CartItemQuantity from "../ui/cart-quantity/CartItemQuantity";
interface CartItemProps {
  id: number;
  title: string;
  codigo: string;
  imagen: string;
  precio: number;
  stock: number;
  editorial?: string;
  autor?: string;
  cantidadInicial: number;
  onRemove: (id: number) => void;
  onUpdate: (id: number, nuevacantidad: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  codigo,
  imagen,
  precio,
  stock,
  editorial,
  autor,
  cantidadInicial,
  onRemove,
  onUpdate,
}) => {
  const [cantidad, setCantidad] = useState(cantidadInicial);
  const [error, setError] = useState("");

  const handleChange = (value: number) => {
    if (cantidad + value > stock || cantidad + value < 1) {
      setError("Cantidad excede el stock disponible");
      return;
    }
    const nuevaCantidad = Math.min(stock, Math.max(1, cantidad + value));

    setCantidad(nuevaCantidad);
    onUpdate(id, nuevaCantidad);
  };
  const subtotal = precio * cantidad;

  return (
    <div className="cart-item">
      <div className="cart-item-container">
        <img src={imagen} alt={title} className="cart-item-img" />

        <div className="cart-item-info">
          <p>
            <strong>Nombre:</strong> {title}
          </p>
          <p>
            <strong>Código:</strong> {codigo}
          </p>
          <p>
            <strong>Editorial:</strong> {editorial}
          </p>
          <p>
            <strong>Autor:</strong> {autor}
          </p>
        </div>
      </div>

      <div className="cart-item-container">
        <CartItemQuantity
          cantidad={cantidad}
          handleChange={handleChange}
          error={error}
          setError={setError}
        />
      </div>

      <div className="cart-item-container">
        <div className="cart-item-price">
          <h3>Costo Unitario</h3>
          <p>$ {precio}</p>
        </div>

        <div className="cart-item-subtotal">
          <h3>SubTotal</h3>
          <p>$ {subtotal.toFixed(2)}</p>
        </div>

        <Btn2
          className="delete-btn"
          onClick={() => onRemove(id)}
          // icon={<span>🗑️</span>}

          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="icon-svg">
              <path
                fill="#8b75a1"
                d="M24.279,3l0.667,2h-9.892l0.667-2H24.279 M24.279,2h-8.558c-0.43,0-0.813,0.275-0.949,0.684L14,5v1h12V5l-0.772-2.316C25.092,2.275,24.71,2,24.279,2z"
              />
              <path
                fill="#dcd5f2"
                d="M8,37.5c-0.827,0-1.5-0.673-1.5-1.5V8.5h27V36c0,0.827-0.673,1.5-1.5,1.5H8z"
              />
              <path
                fill="#8b75a1"
                d="M33,9v27c0,0.551-0.449,1-1,1H8c-0.551,0-1-0.449-1-1V9H33 M34,8H6v28c0,1.105,0.895,2,2,2h24c1.105,0,2-0.895,2-2V8z"
              />
              <path
                fill="#dcd5f2"
                d="M4.5,8.5V7c0-0.827,0.673-1.5,1.5-1.5h28c0.827,0,1.5,0.673,1.5,1.5v1.5H4.5z"
              />
              <path
                fill="#8b75a1"
                d="M34 6c.551 0 1 .449 1 1v1H5V7c0-.551.449-1 1-1H34M34 5H6C4.895 5 4 5.895 4 7v2h32V7C36 5.895 35.105 5 34 5zM24 11H25V35H24zM15 11H16V35H15zM10 11H11V35H10zM29 11H30V35H29z"
              />
            </svg>
          }
        >
          eliminar
        </Btn2>
      </div>
    </div>
  );
};

export default CartItem;
