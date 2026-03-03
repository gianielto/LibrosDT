// import { Request, Response, NextFunction } from "express";
// import prisma from "../prisma";
// import { parse } from "path";

// const getAllProduct = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const Product = await prisma.productos.findMany({
//       where: { eliminado: 0 },
//     });

//     res.json(Product);
//   } catch (error) {
//     next(error);
//   }
// };

// const getProduct = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = parseInt(req.params.id);

//     if (isNaN(id)) {
//       return res.status(400).json({ error: "Invalid Product ID" });
//     }

//     const Product = await prisma.productos.findUnique({
//       where: { id: id },
//     });
//     if (!Product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     return res.json(Product);
//   } catch (error) {
//     next(error);
//   }
// };

// const createProduct = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { id, nombre, codigo, descripcion, costo, stock, archivo_n, archivo } =
//     req.body;

//   try {
//     const newProduct = await prisma.productos.create({
//       data: {
//         id,
//         nombre,
//         codigo,
//         descripcion,
//         costo,
//         stock,
//         archivo_n,
//         archivo,
//       },
//     });
//     res.json(newProduct);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteProduct = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const id = req.params.id;

//     const deleteProduct = await prisma.productos.update({
//       where: { id: Number(id) },
//       data: { eliminado: 1 },
//     });
//     if (!deleteProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     return res.status(204).json({
//       message: "Product deleted successfully",
//       Product: deleteProduct,
//     });
//   } catch (error: any) {
//     if (error.code === "P2025") {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     next(error);
//   }
// };

// const updateProduct = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { id } = req.params;
//     const { nombre, codigo, descripcion, costo, stock, archivo_n, archivo } =
//       req.body;

//     const updateProduct = await prisma.productos.update({
//       where: { id: Number(id) },
//       data: {
//         nombre,
//         codigo,
//         descripcion,
//         costo,
//         stock,
//         archivo_n,
//         archivo,
//       },
//     });
//     return res.json(updateProduct);
//   } catch (error: any) {
//     if (error.code === "P2025") {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     next(error);
//   }
// };

// module.exports = {
//   getAllProduct,
//   getProduct,
//   createProduct,
//   deleteProduct,
//   updateProduct,
// };
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { uploadImage } from "../utils/uploadImage";

const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.productos.findMany({
      where: { eliminado: 0 },
    });

    return res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    const product = await prisma.productos.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nombre, codigo, descripcion, costo, stock } = req.body;

    let imageUrl: string | null = null;

    if (req.file) {
      const result: any = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newProduct = await prisma.productos.create({
      data: {
        nombre,
        codigo,
        descripcion,
        costo: Number(costo),
        stock: Number(stock),
        archivo_n: imageUrl,
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const { nombre, codigo, descripcion, costo, stock } = req.body;

    let imageUrl: string | undefined;

    if (req.file) {
      const result: any = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updatedProduct = await prisma.productos.update({
      where: { id },
      data: {
        nombre,
        codigo,
        descripcion,
        costo: Number(costo),
        stock: Number(stock),
        ...(imageUrl && { imagen: imageUrl }),
      },
    });

    return res.json(updatedProduct);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const deletedProduct = await prisma.productos.update({
      where: { id },
      data: { eliminado: 1 },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    next(error);
  }
};

export {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
