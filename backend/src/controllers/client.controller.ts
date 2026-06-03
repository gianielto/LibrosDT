import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";

import bcrypt from "bcrypt";

export const getAllClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientes = await prisma.clientes.findMany();

    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

export const getClient = async (req: Request, res: Response, next: NextFunction) => {
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

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
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

    const { ...clientWithoutPassword } = newClient;

    res.status(201).json(clientWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const deleteClient = await prisma.clientes.delete({
      where: { id: Number(id) },
    });
    if (!deleteClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.status(204).json({ message: "Client deleted successfully", client: deleteClient });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, correo, pass, telefono, direccion } = req.body;

    const updateClient = await prisma.clientes.update({
      where: { id: Number(id) },
      data: { nombre, apellidos, correo, pass, telefono, direccion },
    });
    return res.json(updateClient);
  } catch (error) {
    next(error);
  }
};
