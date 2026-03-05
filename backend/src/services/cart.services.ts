import prisma from "../prisma";

export const findActiveCart = async (clienteId: number) => {
  return prisma.pedidos.findFirst({
    where: {
      id_cliente: clienteId,
      status: 0,
    },
  });
};

export const getOrCreateCart = async (clienteId: number) => {
  let carrito = await findActiveCart(clienteId);

  if (!carrito) {
    carrito = await prisma.pedidos.create({
      data: {
        fecha: new Date(),
        id_cliente: clienteId,
        status: 0,
      },
    });
  }

  return carrito;
};

export const getCartItems = async (clienteId: number) => {
  const carrito = await prisma.pedidos.findFirst({
    where: {
      id_cliente: clienteId,
      status: 0,
    },
    include: {
      pedidos_productos: {
        include: {
          productos: true,
        },
      },
    },
  });

  if (!carrito) return [];

  return carrito.pedidos_productos.map((item) => ({
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
};
