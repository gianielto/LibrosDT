import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";

const STATUS_LABELS: Record<number, string> = {
  0: "Carrito",
  1: "Pendiente",
  2: "En proceso",
  3: "Enviado",
  4: "Entregado",
};

// ─── Listar pedidos confirmados ───────────────────────────────────────────────
export const adminGetPedidos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status =
      req.query.status !== undefined
        ? parseInt(req.query.status as string)
        : undefined;

    // El admin solo ve pedidos confirmados (status > 0)
    // status=0 son carritos activos de clientes, no pedidos reales
    const where = {
      status: status !== undefined ? status : { gt: 0 },
    };

    const [pedidos, total] = await Promise.all([
      prisma.pedidos.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha: "desc" },
        include: {
          pedidos_productos: {
            include: {
              productos: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                  archivo_url: true,
                },
              },
            },
          },
        },
      }),
      prisma.pedidos.count({ where }),
    ]);

    // Enriquecer la respuesta con datos del cliente y totales
    const pedidosConDetalle = await Promise.all(
      pedidos.map(async (pedido) => {
        const cliente = await prisma.clientes.findUnique({
          where: { id: pedido.id_cliente },
          select: { id: true, nombre: true, apellidos: true, correo: true },
        });

        const total = pedido.pedidos_productos.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0,
        );

        return {
          ...pedido,
          status_label: STATUS_LABELS[pedido.status ?? 1],
          cliente,
          total: Math.round(total * 100) / 100,
        };
      }),
    );

    return res.json({
      data: pedidosConDetalle,
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

// ─── Obtener un pedido con detalle completo ───────────────────────────────────
export const adminGetPedido = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const pedido = await prisma.pedidos.findUnique({
      where: { id },
      include: {
        pedidos_productos: {
          include: {
            productos: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
                costo: true,
                archivo_url: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const cliente = await prisma.clientes.findUnique({
      where: { id: pedido.id_cliente },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        correo: true,
        telefono: true,
        direccion: true,
      },
    });

    const total = pedido.pedidos_productos.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0,
    );

    return res.json({
      ...pedido,
      status_label: STATUS_LABELS[pedido.status ?? 1],
      cliente,
      total: Math.round(total * 100) / 100,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Actualizar status de un pedido ──────────────────────────────────────────
export const adminActualizarStatusPedido = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const { status } = req.body;
    const statusNum = parseInt(status);

    if (isNaN(statusNum) || statusNum < 1 || statusNum > 4) {
      return res.status(400).json({
        message:
          "Status inválido. Valores permitidos: 1 (Pendiente), 2 (En proceso), 3 (Enviado), 4 (Entregado)",
      });
    }

    const pedido = await prisma.pedidos.findUnique({ where: { id } });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // No permitir modificar carritos activos (status 0) desde el admin
    if (pedido.status === 0) {
      return res.status(400).json({
        message: "No se puede modificar un carrito activo",
      });
    }

    // No permitir retroceder el status — un pedido entregado no puede volver a pendiente
    if (statusNum < (pedido.status ?? 1)) {
      return res.status(400).json({
        message: `No se puede retroceder el status de "${STATUS_LABELS[pedido.status ?? 1]}" a "${STATUS_LABELS[statusNum]}"`,
      });
    }

    const pedidoActualizado = await prisma.pedidos.update({
      where: { id },
      data: { status: statusNum },
    });

    return res.json({
      ...pedidoActualizado,
      status_label: STATUS_LABELS[statusNum],
    });
  } catch (error) {
    next(error);
  }
};

// ─── Resumen para el dashboard ────────────────────────────────────────────────
export const adminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const [pedidosMes, pedidosPorStatus, productosBajoStock, totalClientes] =
      await Promise.all([
        // Pedidos confirmados este mes
        prisma.pedidos.findMany({
          where: {
            status: { gt: 0 },
            fecha: { gte: inicioMes },
          },
          include: { pedidos_productos: true },
        }),
        // Conteo por status
        prisma.pedidos.groupBy({
          by: ["status"],
          where: { status: { gt: 0 } },
          _count: { id: true },
        }),
        // Productos con stock bajo (menos de 5 unidades)
        prisma.productos.findMany({
          where: { eliminado: 0, stock: { lte: 5 } },
          select: { id: true, nombre: true, codigo: true, stock: true },
          orderBy: { stock: "asc" },
        }),
        // Total de clientes activos
        prisma.clientes.count({ where: { eliminado: 0 } }),
      ]);

    // Calcular ventas del mes
    const ventasMes = pedidosMes.reduce((sum, pedido) => {
      const totalPedido = pedido.pedidos_productos.reduce(
        (s, item) => s + item.precio * item.cantidad,
        0,
      );
      return sum + totalPedido;
    }, 0);

    // Mapear status con labels
    const statusResumen = pedidosPorStatus.map((s) => ({
      status: s.status,
      label: STATUS_LABELS[s.status ?? 1],
      cantidad: s._count.id,
    }));

    return res.json({
      ventasMes: Math.round(ventasMes * 100) / 100,
      pedidosMes: pedidosMes.length,
      totalClientes,
      productosBajoStock,
      pedidosPorStatus: statusResumen,
    });
  } catch (error) {
    next(error);
  }
};
