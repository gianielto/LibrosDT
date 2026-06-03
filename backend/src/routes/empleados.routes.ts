import { Request, Response, Router } from "express";
//const pool = require("../db");
import {
  getAllEmpleados,
  getEmpleado,
  createEmpleado,
  deleteEmpleado,
  updateEmpleado,
} from "../controllers/Empleado.controller";

const router = Router();

router.get("/Empleados", getAllEmpleados);

router.get("/Empleado/:id", getEmpleado);

router.post("/Empleado", createEmpleado);

router.delete("/Empleado/:id", deleteEmpleado);

router.put("/Empleado/:id", updateEmpleado);

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Empleado API");
});

export default router;
