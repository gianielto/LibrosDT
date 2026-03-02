import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { parse } from "path";

import bcrypt from "bcrypt";

const getAllClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clientes = await prisma.clientes.findMany();

    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const getClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    const client = await prisma.clientes.findUnique({
      where: { id: id },
    });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.json(client);
  } catch (error) {
    next(error);
  }
};

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { nombre, apellidos, correo, pass, telefono, direccion } = req.body;
  const SALT_ROUNDS = 10;
  try {
    if (!correo || !pass) {
      return res.status(400).json({
        message: "Correo y contraseña son obligatorios",
      });
    }

    const hashedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const newClient = await prisma.clientes.create({
      data: {
        nombre,
        apellidos,
        correo,
        pass: hashedPassword,
        telefono,
        direccion,
      },
    });

    const { pass: _, ...clientWithoutPassword } = newClient;

    res.status(201).json(clientWithoutPassword);
  } catch (error: any) {
    res.status(500).json({
      message: "Error al crear cliente",
    });
  }
};

const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    const deleteClient = await prisma.clientes.delete({
      where: { id: Number(id) },
    });
    if (!deleteClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res
      .status(204)
      .json({ message: "Client deleted successfully", client: deleteClient });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Client not found" });
    }
    next(error);
  }
};

const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, correo, pass, telefono, direccion } = req.body;

    const updateClient = await prisma.clientes.update({
      where: { id: Number(id) },
      data: { nombre, apellidos, correo, pass, telefono, direccion },
    });
    return res.json(updateClient);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Client not found" });
    }
    next(error);
  }
};

module.exports = {
  getAllClient,
  getClient,
  createClient,
  deleteClient,
  updateClient,
};
