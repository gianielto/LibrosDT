import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { parse } from "path";
import {
  findActiveCart,
  getCartItems,
  getOrCreateCart,
} from "../services/cart.services";

export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.client) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const clienteId = req.client.id;
  const productoId = Number(req.params.productId);

  const carrito = await prisma.pedidos.findFirst({
    where: {
      id_cliente: clienteId,
      status: 0,
    },
  });
  console.log("Carrito encontrado:", carrito);

  if (!carrito) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }
  console.log("Carrito ID:", carrito.id);
  console.log("Producto ID a eliminar:", productoId);
  await prisma.pedidos_productos.deleteMany({
    where: {
      id_pedido: carrito.id,
      id_producto: productoId,
    },
  });

  res.json({ message: "Producto eliminado del carrito" });
  console.log("Producto eliminado del carrito");
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const items = await getCartItems(req.client.id);

    res.json({ items });
  } catch (error) {
    next(error);
  }
};
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.client) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { productoId, cantidad } = req.body;

  const carrito = await getOrCreateCart(req.client.id);

  const producto = await prisma.productos.findUnique({
    where: { id: productoId },
  });

  if (!producto) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  const existingItem = await prisma.pedidos_productos.findUnique({
    where: {
      id_pedido_id_producto: {
        id_pedido: carrito.id,
        id_producto: productoId,
      },
    },
  });

  if (existingItem) {
    const nuevaCantidad = existingItem.cantidad + cantidad;
    if (!producto.stock) {
      return res.status(400).json({ message: "Producto sin stock disponible" });
    }
    if (nuevaCantidad > producto.stock) {
      return res
        .status(400)
        .json({ message: "Cantidad excede el stock disponible" });
    }

    await prisma.pedidos_productos.update({
      where: { id: existingItem.id },
      data: { cantidad: nuevaCantidad },
    });
  } else {
    await prisma.pedidos_productos.create({
      data: {
        id_pedido: carrito.id,
        id_producto: productoId,
        cantidad,
        precio: producto.costo ?? 0,
      },
    });
  }

  res.json({ message: "Producto agregado" });
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.client) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { productoId, cantidad } = req.body;

  const carrito = await findActiveCart(req.client.id);

  if (!carrito) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  await prisma.pedidos_productos.updateMany({
    where: {
      id_pedido: carrito.id,
      id_producto: productoId,
    },
    data: {
      cantidad,
    },
  });

  res.json({ message: "Cantidad actualizada" });
};
