import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductoDetalle.css";
import Btn1 from "../../Button/Btn1";
import { useAuth } from "../../../../context/useAuth";
import MensajeError from "../../mensajeError/mensajeError";
interface Book {
  nombre: string;
  archivo: string;
  costo: number;
  codigo: string;
  stock: number;
  descripcion: string;
  id: number;
}

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/Product/${codigo}`,
        );
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [codigo]);

  if (!book) {
    return <div>Cargando...</div>;
  }

  const MAX_STOCK = book.stock || 10;

  const handleChange = (signo: string) => {
    const value = signo === "-" ? -1 : 1;
    if (quantity + value > MAX_STOCK) {
      setError("Cantidad excede el stock disponible");
      return;
    }
    setQuantity((prev) => Math.max(1, prev + value));
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productoId: book.id,
          cantidad: quantity,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setError("Producto añadido al carrito");
      } else {
        setError("Error al añadir al carrito: " + data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setError("Error al añadir al carrito: " + error.message);
      } else {
        console.log("Error desconocido", error);
        setError("Error al añadir al carrito: " + error);
      }
    }
  };

  return (
    <div className="detalle-container">
      <div className="detalle-imagen">
        <img src={`/imagenes/productos/${book.archivo}`} alt={book.nombre} />
      </div>

      <div className="detalle-info">
        <h1>{book.nombre}</h1>

        <p>
          <strong>Código:</strong> {book.codigo}
        </p>
        <p>
          <strong>Precio:</strong> ${book.costo}
        </p>
        <p>
          <strong>Stock:</strong> {book.stock}
        </p>

        <h2>Descripción</h2>
        <p>{book.descripcion}</p>

        {user && (
          <>
            <div className="card-book-counter">
              <Btn1 onClick={() => handleChange("-")}>-</Btn1>

              <input
                type="number"
                value={quantity}
                min={1}
                max={MAX_STOCK}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
              />

              <Btn1 onClick={() => handleChange("+")}>+</Btn1>
            </div>

            <Btn1 className="card-book-add" onClick={handleAdd}>
              añadir al carrito
            </Btn1>
          </>
        )}

        <MensajeError mensaje={error} onClose={() => setError("")} />
      </div>
    </div>
  );
}
