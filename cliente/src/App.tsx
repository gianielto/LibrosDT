import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import NavBar from "./components/navBar/NavBar.tsx";
import Productos from "./pages/Productos.tsx";
import BarraInfo from "./components/BarraInfo/BarraInfo.tsx";
import LogIn from "./pages/LogIn.tsx";
import RegistroUsuarios from "./pages/RegistroUsuarios.tsx";
import ProductoDetalle from "./components/ui/productos/ProductoDetalle/ProductoDetalle.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import Carrito from "./pages/Carrito.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
//import "./app.css";

// import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <NavBar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/Home" element={<Home />} />
              <Route path="/Productos" element={<Productos />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LogIn />
                  </PublicRoute>
                }
              />
              <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />
              <Route path="/producto/:codigo" element={<ProductoDetalle />} />
              <Route
                path="/carrito"
                element={
                  <ProtectedRoute>
                    <Carrito />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <BarraInfo />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
