import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";

// ─── Listar clientes ──────────────────────────────────────────────────────────
export const adminGetClientes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const busqueda = req.query.busqueda as string | undefined;

    const where = {
      eliminado: 0,
      ...(busqueda && {
        OR: [
          { nombre: { contains: busqueda, mode: "insensitive" as const } },
          { apellidos: { contains: busqueda, mode: "insensitive" as const } },
          { correo: { contains: busqueda, mode: "insensitive" as const } },
        ],
      }),
    };

    const [clientes, total] = await Promise.all([
      prisma.clientes.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
        select: {
          // Nunca devolvemos el campo pass
          id: true,
          nombre: true,
          apellidos: true,
          correo: true,
          telefono: true,
          direccion: true,
          eliminado: true,
        },
      }),
      prisma.clientes.count({ where }),
    ]);

    return res.json({
      data: clientes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Obtener un cliente con sus pedidos ───────────────────────────────────────
export const adminGetCliente = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const cliente = await prisma.clientes.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        correo: true,
        telefono: true,
        direccion: true,
        eliminado: true,
        // Incluimos sus pedidos confirmados (status > 0)
        pedidos: {
          where: { status: { gt: 0 } },
          orderBy: { fecha: "desc" },
          include: {
            pedidos_productos: {
              include: { productos: true },
            },
          },
        },
      },
    });

    if (!cliente || cliente.eliminado === 1) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.json(cliente);
  } catch (error) {
    next(error);
  }
};

// ─── Actualizar cliente ───────────────────────────────────────────────────────
export const adminActualizarCliente = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const { nombre, apellidos, correo, telefono, direccion } = req.body;

    // Nunca actualizamos el pass desde el panel admin
    const cliente = await prisma.clientes.update({
      where: { id },
      data: { nombre, apellidos, correo, telefono, direccion },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        correo: true,
        telefono: true,
        direccion: true,
      },
    });

    return res.json(cliente);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    if (error.code === "P2002") {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    next(error);
  }
};

// ─── Soft delete de cliente ───────────────────────────────────────────────────
export const adminEliminarCliente = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const cliente = await prisma.clientes.findUnique({ where: { id } });

    if (!cliente || cliente.eliminado === 1) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await prisma.clientes.update({
      where: { id },
      data: { eliminado: 1 },
    });

    return res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
