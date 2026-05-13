// Archivo: backend/src/routes/admin.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  adminLogin,
  adminMe,
} from "../controllers/admin/admin.auth.controller";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  adminGetProductos,
  adminGetProducto,
  adminCrearProducto,
  adminActualizarProducto,
  adminEliminarProducto,
  adminGetCategorias,
  adminCrearCategoria,
  adminGetEditoriales,
  adminCrearEditorial,
  adminGetAutores,
  adminCrearAutor,
} from "../controllers/admin/admin.productos.controller";
import {
  adminGetClientes,
  adminGetCliente,
  adminActualizarCliente,
  adminEliminarCliente,
} from "../controllers/admin/admin.clientes.controller";
import {
  adminGetPedidos,
  adminGetPedido,
  adminActualizarStatusPedido,
  adminDashboard,
} from "../controllers/admin/admin.pedidos.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes JPG, PNG o WebP"));
    }
  },
});

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/auth/login", adminLogin);
router.get("/auth/me", adminMiddleware, adminMe);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get("/dashboard", adminMiddleware, adminDashboard);

// ── Productos ─────────────────────────────────────────────────────────────────
router.get("/productos", adminMiddleware, adminGetProductos);
router.get("/productos/:id", adminMiddleware, adminGetProducto);
router.post(
  "/productos",
  adminMiddleware,
  upload.single("imagen"),
  adminCrearProducto,
);
router.put(
  "/productos/:id",
  adminMiddleware,
  upload.single("imagen"),
  adminActualizarProducto,
);
router.delete("/productos/:id", adminMiddleware, adminEliminarProducto);

// ── Categorías ────────────────────────────────────────────────────────────────
router.get("/categorias", adminMiddleware, adminGetCategorias);
router.post("/categorias", adminMiddleware, adminCrearCategoria);

// ── Editoriales ────────────────────────────────────────────────────────────────
router.get("/editoriales", adminMiddleware, adminGetEditoriales);
router.post("/editoriales", adminMiddleware, adminCrearEditorial);

// ── Autores ─────────────────────────────────────────────
router.get("/autores", adminMiddleware, adminGetAutores);
router.post("/autores", adminMiddleware, adminCrearAutor);

// ── Clientes ──────────────────────────────────────────────────────────────────
router.get("/clientes", adminMiddleware, adminGetClientes);
router.get("/clientes/:id", adminMiddleware, adminGetCliente);
router.put("/clientes/:id", adminMiddleware, adminActualizarCliente);
router.delete("/clientes/:id", adminMiddleware, adminEliminarCliente);

// ── Pedidos ───────────────────────────────────────────────────────────────────
router.get("/pedidos", adminMiddleware, adminGetPedidos);
router.get("/pedidos/:id", adminMiddleware, adminGetPedido);
router.patch(
  "/pedidos/:id/status",
  adminMiddleware,
  adminActualizarStatusPedido,
);

export default router;
