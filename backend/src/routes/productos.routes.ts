import { Request, Response, Router } from "express";
import upload from "../middleware/upload";

const {
  getAllProduct,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/Product.controller");

const router = Router();

router.get("/Product", getAllProduct);

router.get("/Product/:id", getProduct);

router.post("/Product", upload.single("archivo"), createProduct);

router.delete("/Product/:id", deleteProduct);

router.put("/Product/:id", upload.single("archivo"), updateProduct);

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Product API");
});

module.exports = router;
