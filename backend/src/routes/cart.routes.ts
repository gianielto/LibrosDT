// import { Router } from "express";
// import { authMiddleware } from "../middleware/auth.middleware";
// const {
//   getCart,
//   addToCart,
//   removeFromCart,
// } = require("../controllers/cart.controller");

// const router = Router();
// router.use(authMiddleware);

// router.get("/", getCart);
// router.post("/add", addToCart);
// router.delete("/remove/:productId", removeFromCart);

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller";

const router = Router();

import { RequestHandler } from "express";

router.use(authMiddleware as RequestHandler);
router.get("/", getCart as RequestHandler);
router.post("/add", addToCart as RequestHandler);
router.delete("/remove/:productId", removeFromCart as RequestHandler);
router.put("/update", updateCartItem as RequestHandler);

export default router;
