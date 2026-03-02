import "express";
declare module "express" {
  export interface Request {
    client: {
      id: number;
      correo: string;
      nombre: string;
    };
  }
}
