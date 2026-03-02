import { Router } from "express";
//import { login } from "../controllers/auth.controller";
//import { login, getME } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const { login, getME, logout } = require("../controllers/auth.controller");

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, getME);
router.post("/logout", logout);

export default router;
