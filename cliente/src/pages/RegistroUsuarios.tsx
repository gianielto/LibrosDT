import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import CardForm from "../components/ui/CardForm/CardForm";
import Btn1 from "../components/ui/Button/Btn1";
import ButtonLink from "../components/ui/ButtonLink/ButtonLink";
import { clearErrorAfter } from "../utils/ClearError";
import FormField from "../components/ui/FormFile";
import { useNavigate } from "react-router-dom";

interface FormData {
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  correo: string;
  pass: string;
}

const RegistroUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    correo: "",
    pass: "",
  });

  const [errorCorreo, setErrorCorreo] = useState<string>("");
  const [errorGeneral, setErrorGeneral] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = (): boolean => {
    const { nombre, apellidos, telefono, direccion, correo, pass } = formData;

    if (!nombre || !apellidos || !telefono || !direccion || !correo || !pass) {
      setErrorGeneral("Todos los campos son obligatorios.");
      clearErrorAfter(setErrorGeneral);

      return false;
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
      setErrorCorreo("Correo electrónico inválido");
      clearErrorAfter(setErrorCorreo);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorCorreo("");
    setErrorGeneral("");
    console.log("Datos del formulario:", formData);

    if (!validarFormulario()) return;

    try {
      const response = await fetch("http://localhost:4001/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al registrar usuario");
      }

      alert("Usuario registrado exitosamente");
      navigate("/home");

      setFormData({
        nombre: "",
        apellidos: "",
        telefono: "",
        direccion: "",
        correo: "",
        pass: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorGeneral(err.message);
      } else {
        setErrorGeneral("Error desconocido");
      }
      clearErrorAfter(setErrorGeneral);
    }
  };

  return (
    <CardForm title="Crear Cuenta Nueva">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="apellidos">Apellido</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div>
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            {/* <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            /> */}

            <FormField
              label="Correo"
              type="email"
              name="correo"
              htmlfor="correo"
              value={formData.correo}
              onChange={handleChange}
            />
            {errorCorreo && <p className="error">{errorCorreo}</p>}
          </div>
        </div>
        <div className="row">
          <label htmlFor="direccion">Dirección</label>
          <textarea
            id="direccion"
            name="direccion"
            placeholder="Ingresa tu dirección"
            rows={3}
            value={formData.direccion}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="row">
          <label htmlFor="pass">Contraseña</label>
          <input
            type="password"
            id="pass"
            name="pass"
            value={formData.pass}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <label htmlFor="pass2">Contraseña</label>
          <input
            type="password"
            id="pass2"
            name="pass2"
            value={formData.pass}
            onChange={handleChange}
          />
        </div>

        {errorGeneral && <div className="error">{errorGeneral}</div>}
        <div className="row">
          <ButtonLink to="/login">Volver a Login</ButtonLink>
          <Btn1 type="submit">Registrar</Btn1>
        </div>
      </form>
    </CardForm>
  );
};

export default RegistroUsuario;
