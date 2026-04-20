import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";

export const adminLogin = async (req: Request, res: Response) => {
  const { correo, pass } = req.body;

  if (!correo || !pass) {
    return res.status(400).json({ message: "Correo y contraseña requeridos" });
  }

  try {
    const empleado = await prisma.empleados.findFirst({
      where: {
        correo,
        eliminado: 0,
      },
    });

    if (!empleado) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    if (!empleado.pass) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const passwordValida = await bcrypt.compare(pass, empleado.pass);

    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    if (empleado.rol !== 1) {
      return res.status(403).json({ message: "Sin permisos de administrador" });
    }

    const token = jwt.sign(
      {
        empleadoId: empleado.id,
        rol: empleado.rol,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" },
    );

    return res.json({
      token,
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre,
        correo: empleado.correo,
        rol: empleado.rol,
      },
    });
  } catch (error) {
    console.error(error); // 👈 ESTO ES CLAVE
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : error,
    });
  }
  // catch (error) {
  //   return res.status(500).json({ message: "Error interno del servidor1" });
  // }
};

export const adminMe = (req: Request, res: Response) => {
  if (!req.empleado) {
    return res.status(401).json({ message: "No autorizado" });
  }

  return res.json({
    id: req.empleado.id,
    nombre: req.empleado.nombre,
    correo: req.empleado.correo,
    rol: req.empleado.rol,
  });
};
