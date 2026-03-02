import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log("Token recibido en middleware:", token);
  if (!token) {
    return res.status(401).json({ message: "NO TOKEN" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      clientId: number;
    };

    const client = await prisma.clientes.findUnique({
      where: { id: decoded.clientId },
    });

    if (!client) {
      return res.status(401).json({ message: "Usuario no existe" });
    }

    req.client = client;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
// import { verify } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import prisma from "../lib/prisma";

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//   console.log("Token recibido en middleware:", token);

//   if (!token) {
//     res.status(401).json({ message: "NO TOKEN" });
//     return;
//   }

//   try {
//     const decoded = verify(token, process.env.JWT_SECRET!) as {
//       clientId: number;
//     };

//     const client = await prisma.clientes.findUnique({
//       where: { id: decoded.clientId },
//     });

//     if (!client) {
//       res.status(401).json({ message: "Usuario no existe" });
//       return;
//     }

//     req.client = client;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//     return;
//   }
// };
