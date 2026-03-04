// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home.tsx";
// import NavBar from "./components/navBar/NavBar.tsx";
// import Productos from "./pages/Productos.tsx";
// import BarraInfo from "./components/BarraInfo/BarraInfo.tsx";
// import LogIn from "./pages/LogIn.tsx";
// import RegistroUsuarios from "./pages/RegistroUsuarios.tsx";
// import ProductoDetalle from "./components/ui/productos/ProductoDetalle/ProductoDetalle.tsx";
// import { AuthProvider } from "./context/AuthProvider.tsx";
// import Carrito from "./pages/Carrito.tsx";
// import PublicRoute from "./routes/PublicRoute.tsx";
// import ProtectedRoute from "./routes/ProtectedRoute.tsx";
// import { Navigate } from "react-router-dom";
// //import "./app.css";

// // import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "100vh",
//           }}
//         >
//           <NavBar />
//           <div style={{ flex: 1 }}>
//             <Routes>
//               <Route path="/" element={<Navigate to="/home" />} />
//               <Route path="/Home" element={<Home />} />
//               <Route path="/Productos" element={<Productos />} />
//               <Route
//                 path="/login"
//                 element={
//                   <PublicRoute>
//                     <LogIn />
//                   </PublicRoute>
//                 }
//               />
//               <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />
//               <Route path="/producto/:codigo" element={<ProductoDetalle />} />
//               <Route
//                 path="/carrito"
//                 element={
//                   <ProtectedRoute>
//                     <Carrito />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </div>
//           <BarraInfo />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Productos from "./pages/Productos.tsx";
import LogIn from "./pages/LogIn.tsx";
import RegistroUsuarios from "./pages/RegistroUsuarios.tsx";
import ProductoDetalle from "./components/ui/productos/ProductoDetalle/ProductoDetalle.tsx";
import Carrito from "./pages/Carrito.tsx";

import NavBar from "./components/navBar/NavBar.tsx";
import BarraInfo from "./components/BarraInfo/BarraInfo.tsx";

import { AuthProvider } from "./context/AuthProvider.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";

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
              <Route path="/" element={<Navigate to="/home" replace />} />

              <Route path="/home" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LogIn />
                  </PublicRoute>
                }
              />
              <Route path="/registrousuarios" element={<RegistroUsuarios />} />

              <Route path="/producto/:codigo" element={<ProductoDetalle />} />

              <Route
                path="/carrito"
                element={
                  <ProtectedRoute>
                    <Carrito />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>

          <BarraInfo />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
