import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

export const errorHandler = (error: unknown, req: Request, res: Response) => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return res.status(404).json({
          error: "Resource not found",
        });

      case "P2002":
        return res.status(409).json({
          error: "Duplicate value",
        });

      default:
        return res.status(400).json({
          error: error.message,
        });
    }
  }

  if (error instanceof Error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: "Internal Server Error",
  });
};
