import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductoDetalle.css";
interface Book {
  nombre: string;
  archivo: string;
  costo: number;
  codigo: string;
  stock: number;
  descripcion: string;
}
export default function ProductoDetalle() {
  const { codigo } = useParams();
  const [book, setBook] = useState<Book | null>(null);

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
  return (
    <div className="detalle-container">
      <div className="detalle-imagen">
        <img
          src={`../../../imagenes/productos/${book.archivo}`}
          alt={book.nombre}
        />
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
      </div>
    </div>
  );
}
