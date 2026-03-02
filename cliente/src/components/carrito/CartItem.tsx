import { useState } from "react";
import "./CartItem.css";
import MensajeError from "../ui/mensajeError/mensajeError";

interface CartItemProps {
  id: number;
  title: string;
  codigo: string;
  imagen: string;
  precio: number;
  stock: number;
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
      <img src={imagen} alt={title} className="cart-item-img" />

      <div className="cart-item-info">
        <p>
          <strong>Nombre:</strong> {title}
        </p>
        <p>
          <strong>Codigo:</strong> {codigo}
        </p>
      </div>

      <div className="cart-item-quantity">
        <h3>Cantidad</h3>
        <div className="counter">
          <button onClick={() => handleChange(-1)}>-</button>
          <input type="number" value={cantidad} readOnly />
          <button onClick={() => handleChange(1)}>+</button>
        </div>
        <MensajeError mensaje={error} onClose={() => setError("")} />
      </div>

      <div className="cart-item-price">
        <h3>Costo Unitario</h3>
        <p>$ {precio}</p>
      </div>

      <div className="cart-item-subtotal">
        <h3>
          subTotal <br />
        </h3>
        <p>$ {subtotal.toFixed(2)}</p>
      </div>

      <button className="delete-btn" onClick={() => onRemove(id)}>
        eliminar
      </button>
    </div>
  );
};

export default CartItem;
