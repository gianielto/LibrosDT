import { useEffect, useState } from "react";
import CartItem from "../components/carrito/CartItem";

interface Item {
  id: number;
  producto: {
    id: number;
    nombre: string;
    codigo: string;
    precio: number;
    imagen: string;
    stock: number;
  };
  cantidad: number;
}

const Carrito = () => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchCart = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
      credentials: "include",
    });
    const data = await res.json();

    setItems(data?.items || []);

    console.log(data.items.imagen);
  };

  useEffect(() => {
    fetchCart();
  }, []);
  useEffect(() => {}, [items]);

  const handleRemove = async (productoId: number) => {
    console.log("Producto ID a eliminar:", productoId);
    await fetch(`${import.meta.env.VITE_API_URL}/cart/remove/${productoId}`, {
      method: "DELETE",
      credentials: "include",
    });

    setItems((prevItems) =>
      prevItems.filter((item) => item.producto.id !== productoId),
    );
  };

  // const handleUpdate = async (productoId: number, cantidad: number) => {
  //   await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //     body: JSON.stringify({ productoId, cantidad }),
  //   });
  const handleUpdate = async (productoId: number, cantidad: number) => {
    await fetch(`${import.meta.env.VITE_API_URL}/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productoId, cantidad }),
    });

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.producto.id === productoId ? { ...item, cantidad } : item,
      ),
    );
  };
  return (
    <div style={{ padding: "40px" }}>
      {items.map((item) => (
        <CartItem
          key={item.producto.id}
          id={item.producto.id}
          title={item.producto.nombre}
          codigo={item.producto.codigo}
          imagen={`/imagenes/productos/${item.producto.imagen}`}
          precio={item.producto.precio}
          cantidadInicial={item.cantidad}
          stock={item.producto.stock}
          onRemove={handleRemove}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

export default Carrito;
