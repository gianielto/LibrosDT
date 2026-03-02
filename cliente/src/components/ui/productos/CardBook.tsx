import Btn1 from "../Button/Btn1";
import "./CardBook.css";
import { useState } from "react";
import MensajeError from "../mensajeError/mensajeError";
import { Link } from "react-router-dom";

interface CardBookProps {
  id: number;
  title: string;
  img: string;
  precio: number | string;
  codigo: string;
  stock?: number;
}

const CardBook: React.FC<CardBookProps> = ({
  id,
  title,
  img,
  precio,
  codigo,
  stock,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const MAX_STOCK = stock || 10;

  const handleChange = (signo: string) => {
    const value = signo === "-" ? -1 : 1;
    if (quantity + value > MAX_STOCK) {
      setError("Cantidad excede el stock disponible");
      return;
    }

    setQuantity((prev) => Math.max(1, prev + value));
  };

  const handleAdd = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productoId: id,
        cantidad: quantity,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setError("producto añadido al carrito");
    } else {
      setError("Error al añadir al carrito: " + data.message);
    }
  };

  return (
    <div className="card-book">
      <Link to={`/producto/${id}`}>
        <img src={img} alt={title} className="card-book-image" />
      </Link>

      <div className="card-book-details">
        <h3 className="card-book-title">{title}</h3>
        <p className="card-book-price">$ {precio}</p>
        <p className="card-book-code">codigo: {codigo}</p>
      </div>

      <div className="card-book-counter">
        <Btn1 onClick={() => handleChange("-")}>-</Btn1>

        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        />
        <Btn1 onClick={() => handleChange("+")}>+</Btn1>
      </div>
      <MensajeError mensaje={error} onClose={() => setError("")} />
      <Btn1 className="card-book-add" onClick={handleAdd}>
        añadir al carrito
      </Btn1>
    </div>
  );
};

export default CardBook;
