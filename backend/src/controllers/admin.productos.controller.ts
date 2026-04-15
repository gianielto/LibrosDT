import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import cloudinary from "../lib/cloudinary";

// ─── Listar todos los productos (con categoría) ───────────────────────────────
export const adminGetProductos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const busqueda = req.query.busqueda as string | undefined;
    const id_categoria = req.query.id_categoria
      ? parseInt(req.query.id_categoria as string)
      : undefined;

    const where = {
      eliminado: 0,
      ...(busqueda && {
        OR: [
          { nombre: { contains: busqueda, mode: "insensitive" as const } },
          { codigo: { contains: busqueda, mode: "insensitive" as const } },
        ],
      }),
      ...(id_categoria && { id_categoria }),
    };

    const [productos, total] = await Promise.all([
      prisma.productos.findMany({
        where,
        skip,
        take: limit,
        include: { categoria: true },
        orderBy: { fecha_ingreso: "desc" },
      }),
      prisma.productos.count({ where }),
    ]);

    return res.json({
      data: productos,
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

// ─── Obtener un producto por ID ───────────────────────────────────────────────
export const adminGetProducto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const producto = await prisma.productos.findUnique({
      where: { id },
      include: { categoria: true },
    });

    if (!producto || producto.eliminado === 1) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(producto);
  } catch (error) {
    next(error);
  }
};

// ─── Crear producto ───────────────────────────────────────────────────────────
export const adminCrearProducto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nombre, codigo, descripcion, costo, stock, id_categoria } =
      req.body;

    if (!nombre || !codigo || !costo || !stock) {
      return res
        .status(400)
        .json({
          message: "Faltan campos requeridos: nombre, codigo, costo, stock",
        });
    }

    let cloudinary_id: string | undefined;
    let archivo_url: string | undefined;

    // Si llegó una imagen, subirla a Cloudinary
    if (req.file) {
      const resultado = await new Promise<{
        public_id: string;
        secure_url: string;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "librosdt/productos" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          },
        );
        stream.end(req.file!.buffer);
      });

      cloudinary_id = resultado.public_id;
      archivo_url = resultado.secure_url;
    }

    const producto = await prisma.productos.create({
      data: {
        nombre,
        codigo,
        descripcion,
        costo: parseFloat(costo),
        stock: parseInt(stock),
        id_categoria: id_categoria ? parseInt(id_categoria) : undefined,
        cloudinary_id,
        archivo_url,
      },
    });

    return res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};

// ─── Actualizar producto ──────────────────────────────────────────────────────
export const adminActualizarProducto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const { nombre, codigo, descripcion, costo, stock, id_categoria } =
      req.body;

    // Buscar el producto actual para saber si tiene imagen vieja
    const productoActual = await prisma.productos.findUnique({
      where: { id },
    });

    if (!productoActual || productoActual.eliminado === 1) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    let cloudinary_id = productoActual.cloudinary_id ?? undefined;
    let archivo_url = productoActual.archivo_url ?? undefined;

    // Si llegó una imagen nueva, borrar la vieja y subir la nueva
    if (req.file) {
      if (productoActual.cloudinary_id) {
        await cloudinary.uploader.destroy(productoActual.cloudinary_id);
      }

      const resultado = await new Promise<{
        public_id: string;
        secure_url: string;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "librosdt/productos" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          },
        );
        stream.end(req.file!.buffer);
      });

      cloudinary_id = resultado.public_id;
      archivo_url = resultado.secure_url;
    }

    const productoActualizado = await prisma.productos.update({
      where: { id },
      data: {
        nombre,
        codigo,
        descripcion,
        costo: costo ? parseFloat(costo) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        id_categoria: id_categoria ? parseInt(id_categoria) : undefined,
        cloudinary_id,
        archivo_url,
      },
    });

    return res.json(productoActualizado);
  } catch (error) {
    next(error);
  }
};

// ─── Eliminar producto (soft delete) ─────────────────────────────────────────
export const adminEliminarProducto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const producto = await prisma.productos.findUnique({ where: { id } });

    if (!producto || producto.eliminado === 1) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Borrar imagen de Cloudinary si existe
    if (producto.cloudinary_id) {
      await cloudinary.uploader.destroy(producto.cloudinary_id);
    }

    await prisma.productos.update({
      where: { id },
      data: { eliminado: 1 },
    });

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

// ─── CRUD de categorías ───────────────────────────────────────────────────────
export const adminGetCategorias = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categorias = await prisma.categorias.findMany({
      where: { eliminado: 0 },
      orderBy: { nombre: "asc" },
    });
    return res.json(categorias);
  } catch (error) {
    next(error);
  }
};

export const adminCrearCategoria = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nombre, slug } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ message: "Nombre y slug son requeridos" });
    }

    const categoria = await prisma.categorias.create({
      data: { nombre, slug },
    });

    return res.status(201).json(categoria);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "El slug ya existe" });
    }
    next(error);
  }
};
