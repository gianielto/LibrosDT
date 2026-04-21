import "./NavBar.css";
import ButtonLink from "../ui/ButtonLink/ButtonLink";
import { useAuth } from "../../context/useAuth";
import Btn1 from "../ui/Button/Btn1";
import OfflineBanner from "../ui/OfflineBanner/OfflineBanner"; // ← import
// import usePushNotifications from "../../hooks/usePushNotifications";
import BellButton from "../ui/BellButton/BellButton"; // ← import

const NavBar = () => {
  const { user, logout, loading } = useAuth();
  // const { subscribe, isSubscribed } = usePushNotifications();
  // const handleSubscribe = () => {
  // subscribe(1); // 👈 aquí debe ir el ID real del usuario logueado
  // };
  if (loading) return null;

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

        <ul className="listaHorizontal">
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
          {/* <li>
            <button onClick={handleSubscribe}>Activar notificaciones</button>

            {isSubscribed && <p>Suscrito ✔️</p>}
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
