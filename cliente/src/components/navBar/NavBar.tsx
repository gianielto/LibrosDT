// NavBar.tsx
// import "./NavBar.css";
// import ButtonLink from "../ui/ButtonLink/ButtonLink";
// import { useAuth } from "../../context/useAuth";
// import Btn1 from "../ui/Button/Btn1";
// import OfflineBanner from "../ui/OfflineBanner/OfflineBanner";
// import BellButton from "../ui/BellButton/BellButton";

// const NavBar = () => {
//   const { user, logout, loading } = useAuth();
//   if (loading) return null;

//   return (
//     <>
//       <OfflineBanner />
//       <div className="barraMenu statico">
//         <div className="nombreCliente">Libros DT</div>
//         <div className="izquierda logo-bar">
//           <div
//             className="logo claro"
//             style={{ backgroundImage: "url('/imagenes/logoCliente.jpeg')" }}
//           ></div>
//         </div>

//         <ul className="listaHorizontal">
//           {user && (
//             <li id="saludo">
//               <p>Hola, {user.nombre}</p>
//             </li>
//           )}
//           {user && (
//             <li>
//               <BellButton />
//             </li>
//           )}

//           <li>
//             <ButtonLink to="/home">Home</ButtonLink>
//           </li>
//           <li>
//             <ButtonLink to="/productos">Productos</ButtonLink>
//           </li>
//           <li>
//             <ButtonLink to="/contacto">Contacto</ButtonLink>
//           </li>
//           {user && (
//             <li id="carrito">
//               <ButtonLink to="/carrito">Carrito</ButtonLink>
//             </li>
//           )}
//           <li>
//             {user ? (
//               <Btn1 onClick={logout}>Log out</Btn1>
//             ) : (
//               <ButtonLink to="/login">Log in</ButtonLink>
//             )}
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default NavBar;

// NavBar.tsx
import "./NavBar.css";
import ButtonLink from "../ui/ButtonLink/ButtonLink";
import { useAuth } from "../../context/useAuth";
import Btn1 from "../ui/Button/Btn1";
import OfflineBanner from "../ui/OfflineBanner/OfflineBanner";
import BellButton from "../ui/BellButton/BellButton";
import { useState } from "react";

const NavBar = () => {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <OfflineBanner />
      <div className="barraMenu statico">
        <div className="nombreCliente">Libros DT</div>
        <div className="izquierda logo-bar">
          <div
            className="logo claro"
            style={{ backgroundImage: "url('/imagenes/logoCliente.jpeg')" }}
          ></div>
        </div>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`listaHorizontal ${menuOpen ? "menu-open" : ""}`}>
          {user && (
            <li id="saludo">
              <p>Hola, {user.nombre}</p>
            </li>
          )}
          {user && (
            <li>
              <BellButton />
            </li>
          )}
          <li>
            <ButtonLink to="/home" onClick={closeMenu}>
              Home
            </ButtonLink>
          </li>
          <li>
            <ButtonLink to="/productos" onClick={closeMenu}>
              Productos
            </ButtonLink>
          </li>
          <li>
            <ButtonLink to="/contacto" onClick={closeMenu}>
              Contacto
            </ButtonLink>
          </li>
          {user && (
            <li id="carrito">
              <ButtonLink to="/carrito" onClick={closeMenu}>
                Carrito
              </ButtonLink>
            </li>
          )}
          <li>
            {user ? (
              <Btn1
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Log out
              </Btn1>
            ) : (
              <ButtonLink to="/login" onClick={closeMenu}>
                Log in
              </ButtonLink>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavBar;
