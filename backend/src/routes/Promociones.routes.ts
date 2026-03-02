import { Request, Response, Router } from "express";
const {
  getAllPromociones,
  getPromocion,
  createPromocion,
  deletePromocion,
  updatePromocion,
} = require("../controllers/Promociones.controller");

const router = Router();

router.get("/Promociones", getAllPromociones);

router.get("/Promocion/:id", getPromocion);

router.post("/Promocion", createPromocion);

router.delete("/Promocion/:id", deletePromocion);

router.put("/Promocion/:id", updatePromocion);

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Promocion API");
});

module.exports = router;
