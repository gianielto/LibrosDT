import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      empleadoId: number;
      rol: number;
    };

    const empleado = await prisma.empleados.findUnique({
      where: { id: decoded.empleadoId },
    });

    if (!empleado || empleado.eliminado === 1) {
      return res.status(401).json({ message: "Empleado no existe" });
    }

    if (empleado.rol !== 1) {
      return res.status(403).json({ message: "Sin permisos de administrador" });
    }

    req.empleado = {
      id: empleado.id,
      correo: empleado.correo ?? "",
      nombre: empleado.nombre ?? "",
      rol: empleado.rol ?? 0,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
