import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { parse } from "path";

const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Product = await prisma.productos.findMany({
      where: { eliminado: 0 },
    });

    res.json(Product);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    const Product = await prisma.productos.findUnique({
      where: { id: id },
    });
    if (!Product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(Product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, nombre, codigo, descripcion, costo, stock, archivo_n, archivo } =
    req.body;

  try {
    const newProduct = await prisma.productos.create({
      data: {
        id,
        nombre,
        codigo,
        descripcion,
        costo,
        stock,
        archivo_n,
        archivo,
      },
    });
    res.json(newProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    const deleteProduct = await prisma.productos.update({
      where: { id: Number(id) },
      data: { eliminado: 1 },
    });
    if (!deleteProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(204).json({
      message: "Product deleted successfully",
      Product: deleteProduct,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, descripcion, costo, stock, archivo_n, archivo } =
      req.body;

    const updateProduct = await prisma.productos.update({
      where: { id: Number(id) },
      data: {
        nombre,
        codigo,
        descripcion,
        costo,
        stock,
        archivo_n,
        archivo,
      },
    });
    return res.json(updateProduct);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    next(error);
  }
};

module.exports = {
  getAllProduct,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
