// Productos.tsx
import CardBook from "../components/ui/productos/CardBook";
import GridBook from "../components/ui/productos/gridBook";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  nombre: string;
  archivo: string;
  costo: number;
  codigo: string;
  stock: number;
  archivo_url?: string;
  editorial?: {
    id: number;
    nombre: string;
  };
  productos_autores?: {
    autor: {
      id: number;
      nombre: string;
    };
  }[];
}
interface ProductosProps {
  numberOfProducts?: number;
}

export default function Productos({ numberOfProducts }: ProductosProps) {
  const [books, setbooks] = useState<Book[]>([]);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/Product`);
        const data = await res.json();
        console.log("Fetched books:", data);
        if (numberOfProducts) {
          const randomFive = data.sort(() => Math.random() - 0.4).slice(0, numberOfProducts);
          setbooks(randomFive);
        } else {
          setbooks(data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [numberOfProducts]);

  return (
    <GridBook>
      {books.map((book) => (
        <CardBook
          key={book.id}
          id={book.id}
          title={book.nombre}
          // img={`/imagenes/productos/${book.archivo}`}
          img={book.archivo_url || `/imagenes/productos/${book.archivo}`}
          precio={`${book.costo}`}
          // codigo={book.codigo}
          // stock={book.stock}
          editorial={book.editorial?.nombre || "Sin editorial"}
          // autor={book.productos_autores?.[0]?.autor?.nombre || "Sin autor"}
          autor={book.productos_autores?.map((pa) => pa.autor.nombre).join(", ") || "Sin autor"}
        />
      ))}
    </GridBook>
  );
}
