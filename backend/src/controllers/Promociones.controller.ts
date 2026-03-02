import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { parse } from "path";

const getAllPromociones = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Promociones = await prisma.promociones.findMany({
      where: { eliminado: 0, status: 1 },
    });

    res.json(Promociones);
  } catch (error) {
    next(error);
  }
};

const getPromocion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid Promocion ID" });
    }

    const Promocion = await prisma.promociones.findUnique({
      where: { id: id },
    });
    if (!Promocion) {
      return res.status(404).json({ error: "Promocion not found" });
    }
    return res.json(Promocion);
  } catch (error) {
    next(error);
  }
};

const createPromocion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { nombre, archivo, status } = req.body;

  try {
    const newPromocion = await prisma.promociones.create({
      data: {
        nombre,
        archivo,
        status,
      },
    });
    res.json(newPromocion);
  } catch (error) {
    next(error);
  }
};

const deletePromocion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    const deletePromocion = await prisma.promociones.update({
      where: { id: Number(id) },
      data: { eliminado: 1 },
    });
    if (!deletePromocion) {
      return res.status(404).json({ error: "Promocion not found" });
    }
    return res.status(204).json({
      message: "Promocion deleted successfully",
      Promocion: deletePromocion,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Promocion not found" });
    }
    next(error);
  }
};

const updatePromocion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { nombre, archivo, status } = req.body;

    const updatePromocion = await prisma.promociones.update({
      where: { id: Number(id) },
      data: {
        nombre,
        archivo,
        status,
      },
    });
    return res.json(updatePromocion);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Promocion not found" });
    }
    next(error);
  }
};

module.exports = {
  getAllPromociones,
  getPromocion,
  createPromocion,
  deletePromocion,
  updatePromocion,
};
