import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { parse } from "path";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const clienteId = req.client.id;

    const carrito = await prisma.pedidos.findUnique({
      where: {
        id_cliente_status: {
          id_cliente: clienteId,
          status: 0,
        },
      },
      include: {
        pedidos_productos: {
          include: {
            productos: true,
          },
        },
      },
    });

    if (!carrito) {
      return res.json({ items: [] });
    }

    const items = carrito.pedidos_productos.map((item) => ({
      id: item.id,
      cantidad: item.cantidad,
      producto: {
        id: item.productos.id,
        nombre: item.productos.nombre,
        codigo: item.productos.codigo,
        precio: item.productos.costo,
        imagen: item.productos.archivo,
        stock: item.productos.stock,
      },
    }));

    return res.json({ items });
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

  const clienteId = req.client.id;
  const { productoId, cantidad } = req.body;

  let carrito = await prisma.pedidos.findUnique({
    where: { id_cliente_status: { id_cliente: clienteId, status: 0 } },
  });

  if (!carrito) {
    carrito = await prisma.pedidos.create({
      data: {
        fecha: new Date(),
        id_cliente: clienteId,
        status: 0,
      },
    });
  }

  const producto = await prisma.productos.findUnique({
    where: { id: productoId },
  });

  if (!producto) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  const precioUnitario = producto.costo ?? 0;

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
    const stockDisponible = producto.stock ?? 0;
    if (nuevaCantidad > stockDisponible) {
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
        precio: precioUnitario,
      },
    });
  }

  res.json({ message: "Producto agregado" });
};

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
  console.log("Cliente ID:", clienteId);
  console.log("Producto ID:", productoId);
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
export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.client) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const clienteId = req.client.id;
  const { productoId, cantidad } = req.body;

  const carrito = await prisma.pedidos.findFirst({
    where: {
      id_cliente: clienteId,
      status: 0,
    },
  });

  if (!carrito) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  const producto = await prisma.productos.findUnique({
    where: { id: productoId },
  });

  if (!producto) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  if (!producto.stock) {
    return res.status(400).json({ message: "Producto sin stock disponible" });
  }
  if (cantidad > producto.stock) {
    return res
      .status(400)
      .json({ message: "Cantidad excede el stock disponible" });
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
