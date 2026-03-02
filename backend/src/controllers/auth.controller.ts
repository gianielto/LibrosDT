import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

const login = async (req: Request, res: Response) => {
  const { correo, pass } = req.body;

  if (!correo || !pass) {
    return res.status(400).json({ message: "S Faltan datos" });
  }

  const client = await prisma.clientes.findUnique({
    where: { correo },
  });
  if (!client) {
    return res.status(401).json({ message: "Credenciales incorrectas1" });
  }

  if (!bcrypt.compare(pass, client.pass)) {
    return res.status(401).json({ message: "Credenciales incorrectas2" });
  }
  const token = jwt.sign({ clientId: client.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.json({ message: "Login exitoso" });
};
const getME = (req: Request, res: Response) => {
  res.json({
    id: req.client.id,
    correo: req.client.correo,
    nombre: req.client.nombre,
  });
};
const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true si usas https en producción
    sameSite: "lax",
  });

  return res.json({ message: "Logout exitoso" });
};
module.exports = {
  login,
  getME,
  logout,
};
