// Usar hooks para imputs repetidos.
// considerer componente formfile para reutilizar codigo a  la hora de crear formularios
import { useState } from "react";
import CardForm from "../components/ui/CardForm/CardForm";
import Btn1 from "../components/ui/Button/Btn1";
import ButtonLink from "../components/ui/ButtonLink/ButtonLink";
import { clearErrorAfter } from "../utils/ClearError";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const { login } = useAuth();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!correo || !pass) {
      setErrorMensaje("Faltan campos por llenar");

      clearErrorAfter(setErrorMensaje);
      return;
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      setErrorMensaje("Correo electrónico inválido");
      clearErrorAfter(setErrorMensaje);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ correo, pass }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Credenciales incorrectas");
      }

      await login();
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMensaje(error.message);
      } else {
        setErrorMensaje("Correo o contraseña incorrectos");
      }
      clearErrorAfter(setErrorMensaje);
    }
    //
  };
  return (
    <CardForm title="Login">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <label htmlFor="pass">Contraseña</label>
          <input
            type="password"
            id="pass"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>

        <br />

        {errorMensaje && <p className="error">{errorMensaje}</p>}

        <div className="row">
          <ButtonLink to="/RegistroUsuarios">Crear Cuenta </ButtonLink>
          <Btn1 type="submit">Ingresar</Btn1>
        </div>
      </form>
    </CardForm>
  );
};

export default LogIn;
