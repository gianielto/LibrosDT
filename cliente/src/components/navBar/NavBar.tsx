// //import React from "react";
// import "./NavBar.css";
// import ButtonLink from "../ui/ButtonLink/ButtonLink";

// const NavBar = () => {
//   return (
//     <div className="barraMenu statico">
//       <div className="nombreCliente">Libros DT</div>

//       <div className="izquierda logo-bar">
//         <div
//           className="logo claro"
//           style={{ backgroundImage: "url('imagenes/logoCliente.jpeg')" }}
//         ></div>
//       </div>

//       <div>
//         <ul className="listaHorizontal">
//           <li id="saludo" className="oculto">
//             <p>hola</p>
//           </li>
//           <li>
//             <ButtonLink to="/home">Home</ButtonLink>
//           </li>
//           <li>
//             <ButtonLink to="/productos">Productos</ButtonLink>
//           </li>
//           <li>
//             <ButtonLink to="/contacto">Contacto</ButtonLink>
//           </li>
//           <li className="oculto" id="carrito">
//             <ButtonLink to="/carrito">Carrito</ButtonLink>
//           </li>
//           <li id="logIn">
//             <ButtonLink to="/login">Log in</ButtonLink>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NavBar;

// // import { useEffect, useState } from "react";
// // import "./NavBar.css";

// // function NavBar() {
// //   const [isHidden, setIsHidden] = useState(false);
// //   const [lastScrollY, setLastScrollY] = useState(0);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       const currentScrollY = window.scrollY;

// //       if (currentScrollY > lastScrollY) {
// //         // Bajando → ocultar navbar
// //         setIsHidden(true);
// //       } else {
// //         // Subiendo → mostrar navbar
// //         setIsHidden(false);
// //       }

// //       setLastScrollY(currentScrollY);
// //     };

// //     window.addEventListener("scroll", handleScroll);

// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, [lastScrollY]);

// //   return (
// //     <nav className={`statico barraMenu ${isHidden ? "oculto" : ""}`}>
// //       {/* contenido de tu navbar */}
// //     </nav>
// //   );
// // }

// // export default NavBar;
import "./NavBar.css";
import ButtonLink from "../ui/ButtonLink/ButtonLink";
import { useAuth } from "../../context/useAuth";
import Btn1 from "../ui/Button/Btn1";

const NavBar = () => {
  const { user, logout, loading } = useAuth();
  console.log("USER:", user);

  if (loading) return null;

  return (
    <div className="barraMenu statico">
      <div className="nombreCliente">Libros DT</div>

      <div className="izquierda logo-bar">
        <div
          className="logo claro"
          style={{ backgroundImage: "url('/imagenes/logoCliente.jpeg')" }}
        ></div>
      </div>

      <ul className="listaHorizontal">
        {user && (
          <li id="saludo">
            <p>Hola, {user.nombre}</p>
          </li>
        )}

        <li>
          <ButtonLink to="/home">Home</ButtonLink>
        </li>
        <li>
          <ButtonLink to="/productos">Productos</ButtonLink>
        </li>
        <li>
          <ButtonLink to="/contacto">Contacto</ButtonLink>
        </li>

        {user && (
          <li id="carrito">
            <ButtonLink to="/carrito">Carrito</ButtonLink>
          </li>
        )}

        <li>
          {user ? (
            <Btn1 onClick={logout}>Log out</Btn1>
          ) : (
            <ButtonLink to="/login">Log in</ButtonLink>
          )}
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
