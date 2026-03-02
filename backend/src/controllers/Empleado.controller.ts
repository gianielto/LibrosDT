import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { parse } from "path";

const getAllEmpleados = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Empleados = await prisma.empleados.findMany();
    res.json(Empleados);
  } catch (error) {
    next(error);
  }
};

const getEmpleado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid Empleado ID" });
    }

    const Empleado = await prisma.empleados.findUnique({
      where: { id: id },
    });
    if (!Empleado) {
      return res.status(404).json({ error: "Empleado not found" });
    }
    return res.json(Empleado);
  } catch (error) {
    next(error);
  }
};

const createEmpleado = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    id,
    nombre,
    apellidos,
    correo,
    pass,
    rol,
    archivo_nombre,
    archivo_file,
    eliminado,
  } = req.body;

  try {
    const newEmpleado = await prisma.empleados.create({
      data: {
        id,
        nombre,
        apellidos,
        correo,
        pass,
        rol,
        archivo_nombre,
        archivo_file,
        eliminado,
      },
    });
    res.json(newEmpleado);
  } catch (error) {
    next(error);
  }
};

const deleteEmpleado = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    const deleteEmpleado = await prisma.empleados.update({
      where: { id: Number(id) },
      data: { eliminado: 1 },
    });
    if (!deleteEmpleado) {
      return res.status(404).json({ error: "Empleado not found" });
    }
    return res.status(204).json({
      message: "Empleado deleted successfully",
      Empleado: deleteEmpleado,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Empleado not found" });
    }
    next(error);
  }
};

const updateEmpleado = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellidos,
      correo,
      pass,
      rol,
      archivo_nombre,
      archivo_file,
      eliminado,
    } = req.body;

    const updateEmpleado = await prisma.empleados.update({
      where: { id: Number(id) },
      data: {
        nombre,
        apellidos,
        correo,
        pass,
        rol,
        archivo_nombre,
        archivo_file,
        eliminado,
      },
    });
    return res.json(updateEmpleado);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Empleado not found" });
    }
    next(error);
  }
};

module.exports = {
  getAllEmpleados,
  getEmpleado,
  createEmpleado,
  deleteEmpleado,
  updateEmpleado,
};
