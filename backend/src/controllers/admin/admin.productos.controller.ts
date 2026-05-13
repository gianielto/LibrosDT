// Archivo: backend/src/controllers/admin/admin.productos.controller.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import cloudinary from "../../lib/cloudinary";

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

    // const where = {
    //   eliminado: false,
    //   ...(busqueda && {
    //     OR: [
    //       { nombre: { contains: busqueda, mode: "insensitive" as const } },
    //       { codigo: { contains: busqueda, mode: "insensitive" as const } },
    //     ],
    //   }),
    //   ...(id_categoria && { id_categoria }),
    // };
    const id_editorial = req.query.id_editorial
      ? parseInt(req.query.id_editorial as string)
      : undefined;

    const where = {
      eliminado: false,
      ...(busqueda && {
        OR: [
          { nombre: { contains: busqueda, mode: "insensitive" as const } },
          { codigo: { contains: busqueda, mode: "insensitive" as const } },
        ],
      }),
      ...(id_categoria && { id_categoria }),
      ...(id_editorial && { id_editorial }), // 👈 FALTABA
    };
    const [productos, total] = await Promise.all([
      prisma.productos.findMany({
        where,
        skip,
        take: limit,
        include: {
          categoria: true,
          editorial: true,
          productos_autores: {
            include: {
              autor: true,
            },
          },
        },
        orderBy: { fecha_ingreso: "desc" },
      }),
      prisma.productos.count({ where }),
    ]);
    const productosLimpios = productos.map((p) => ({
      ...p,
      autores: p.productos_autores.map((pa) => pa.autor),
    }));

    return res.json({
      data: productosLimpios,
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
      include: {
        categoria: true,
        editorial: true,
        productos_autores: {
          include: {
            autor: true,
          },
        },
      },
    });

    if (!producto || producto.eliminado === true) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const productoLimpio = {
      ...producto,
      autores: producto.productos_autores.map((pa) => pa.autor),
    };
    // return res.json(producto);
    return res.json(productoLimpio);
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
    const {
      nombre,
      codigo,
      descripcion,
      costo,
      stock,
      id_categoria,
      id_editorial,
      autores,
    } = req.body;
    let autoresIds: number[] = [];

    if (autores) {
      autoresIds = typeof autores === "string" ? JSON.parse(autores) : autores;
    }

    if (!nombre || !codigo || !costo || !stock) {
      return res.status(400).json({
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

    // const producto = await prisma.productos.create({
    //   data: {
    //     nombre,
    //     codigo,
    //     descripcion,
    //     costo: parseFloat(costo),
    //     stock: parseInt(stock),
    //     id_categoria: id_categoria ? parseInt(id_categoria) : undefined,
    //     id_editorial: id_editorial ? parseInt(id_editorial) : undefined,
    //     cloudinary_id,
    //     archivo_url,
    //     productos_autores: autores
    //       ? {
    //           create: autores.map((id_autor: number) => ({
    //             autor: { connect: { id: id_autor } },
    //           })),
    //         }
    //       : undefined,
    //   },
    // });
    const producto = await prisma.productos.create({
      data: {
        nombre,
        codigo,
        descripcion,
        costo: parseFloat(costo),
        stock: parseInt(stock),
        id_categoria: id_categoria ? parseInt(id_categoria) : undefined,
        id_editorial: id_editorial ? parseInt(id_editorial) : undefined,
        cloudinary_id,
        archivo_url,

        // productos_autores: autores
        //   ? {
        //       create: autores.map((id_autor: number) => ({
        //         autor: { connect: { id: id_autor } },
        //       })),
        //     }
        //   : undefined,
        productos_autores: autoresIds.length
          ? {
              create: autoresIds.map((id_autor) => ({
                autor: { connect: { id: id_autor } },
              })),
            }
          : undefined,
      },
      include: {
        categoria: true,
        editorial: true,
        productos_autores: {
          include: {
            autor: true,
          },
        },
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

    const {
      nombre,
      codigo,
      descripcion,
      costo,
      stock,
      id_categoria,
      id_editorial,
      autores,
    } = req.body;
    let autoresIds: number[] = [];

    if (autores) {
      autoresIds = typeof autores === "string" ? JSON.parse(autores) : autores;
    }

    // Buscar el producto actual para saber si tiene imagen vieja
    const productoActual = await prisma.productos.findUnique({
      where: { id },
    });

    if (!productoActual || productoActual.eliminado === true) {
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

    // const productoActualizado = await prisma.productos.update({
    //   where: { id },
    //   data: {
    //     nombre,
    //     codigo,
    //     descripcion,
    //     costo: costo ? parseFloat(costo) : undefined,
    //     stock: stock ? parseInt(stock) : undefined,
    //     id_categoria: id_categoria ? parseInt(id_categoria) : undefined,
    //     id_editorial: id_editorial ? parseInt(id_editorial) : undefined,
    //     cloudinary_id,
    //     archivo_url,
    //   },
    // });
    const productoActualizado = await prisma.productos.update({
      where: { id },
      data: {
        nombre,
        codigo,
        descripcion,
        costo: costo ? parseFloat(costo) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        id_categoria: id_categoria ? parseInt(id_categoria) : undefined,
        id_editorial: id_editorial ? parseInt(id_editorial) : undefined,
        cloudinary_id,
        archivo_url,

        productos_autores: autoresIds.length
          ? {
              deleteMany: {},
              create: autoresIds.map((id_autor: number) => ({
                autor: { connect: { id: id_autor } },
              })),
            }
          : undefined,
      },
      include: {
        categoria: true,
        editorial: true,
        productos_autores: {
          include: {
            autor: true,
          },
        },
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

    if (!producto || producto.eliminado === true) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Borrar imagen de Cloudinary si existe
    if (producto.cloudinary_id) {
      await cloudinary.uploader.destroy(producto.cloudinary_id);
    }

    await prisma.productos.update({
      where: { id },
      data: { eliminado: true },
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
      where: { eliminado: false },
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

// ─── CRUD de Editoriales ───────────────────────────────────────────────────────
export const adminGetEditoriales = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const editoriales = await prisma.editoriales.findMany({
      where: { eliminado: false },
      orderBy: { nombre: "asc" },
    });
    return res.json(editoriales);
  } catch (error) {
    next(error);
  }
};

export const adminCrearEditorial = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nombre, slug } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ message: "Nombre y slug son requeridos" });
    }

    const editorial = await prisma.editoriales.create({
      data: { nombre, slug },
    });

    return res.status(201).json(editorial);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "El slug ya existe" });
    }
    next(error);
  }
};

// ─── CRUD de Autores ───────────────────────────────────────────────

// export const adminGetAutores = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const autores = await prisma.autores.findMany({
//       where: { eliminado: false },
//       orderBy: { nombre: "asc" },
//     });

//     return res.json(autores);
//   } catch (error) {
//     next(error);
//   }
// };
export const adminGetAutores = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = req.query.search as string;

    const autores = await prisma.autores.findMany({
      where: {
        eliminado: false,
        ...(search && {
          nombre: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      orderBy: { nombre: "asc" },
      take: 10,
    });

    res.json(autores);
  } catch (error) {
    next(error);
  }
};

export const adminCrearAutor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nombre, slug, fecha_nacimiento, nacionalidad } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({
        message: "Nombre y slug son requeridos",
      });
    }

    const autor = await prisma.autores.create({
      data: {
        nombre,
        slug,
        fecha_nacimiento: fecha_nacimiento
          ? new Date(fecha_nacimiento)
          : undefined,
        nacionalidad,
      },
    });

    return res.status(201).json(autor);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "El slug ya existe" });
    }
    next(error);
  }
};
