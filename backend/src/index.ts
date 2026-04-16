// import { Request, Response, NextFunction } from "express";
// import cookieParser from "cookie-parser";
// //import { authMiddleware } from "./middleware/auth.middleware";

// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// const ClientesRoutes = require("./routes/clientes.routes");
// const ProductsRoutes = require("./routes/productos.routes");
// const EmpleadosRoutes = require("./routes/empleados.routes");
// const PromocionesRoutes = require("./routes/Promociones.routes");
// import cartRoutes from "./routes/cart.routes";
// // const adminRoutes = require("./routes/admin.routes");
// import adminRoutes from "./routes/admin.routes";
// import auth from "./routes/auth.routes";

// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4001;

// app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://librosdt.vercel.app"],
//     credentials: true,
//   }),
// );
// app.use(express.json());
// app.use("/auth", auth);
// app.use("/cart", cartRoutes);
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(ClientesRoutes);
// app.use(ProductsRoutes);
// app.use(EmpleadosRoutes);
// app.use(PromocionesRoutes);
// // app.use(adminRoutes);
// app.use("/api/admin", adminRoutes);
// //app.use(authMiddleware);

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   return res.json({
//     message: err.message,
//     //message: "Internal server error",
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes"; // ← añadido

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const ClientesRoutes = require("./routes/clientes.routes");
const ProductsRoutes = require("./routes/productos.routes");
const EmpleadosRoutes = require("./routes/empleados.routes");
const PromocionesRoutes = require("./routes/Promociones.routes");
import cartRoutes from "./routes/cart.routes";
import auth from "./routes/auth.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://librosdt.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/admin", adminRoutes); // ← añadido
app.use("/auth", auth);
app.use("/cart", cartRoutes);
app.use(morgan("dev"));
app.use(ClientesRoutes);
app.use(ProductsRoutes);
app.use(EmpleadosRoutes);
app.use(PromocionesRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
