import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    client?: {
      id: number;
      correo: string;
      nombre: string;
    };
  }
}
