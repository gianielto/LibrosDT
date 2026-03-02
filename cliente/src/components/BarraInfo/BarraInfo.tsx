//import React from "react";
import "./BarraInfo.css";
import { Link } from "react-router-dom";
const BarraInfo: React.FC = () => {
  return (
    <div className="barraInfo-footer">
      <div className="centrado">
        <div className="titulo fuenteClaro">Redes</div>
        <div className="izquierda logo-bar">
          <Link
            to="https://www.instagram.com/librerias_gandhi/?hl=es"
            className="logo claro"
            style={{ backgroundImage: "url('imagenes/iconoInstagram.PNG')" }}
          ></Link>
          <Link
            to="https://www.facebook.com/InformaticaCUCEI?locale=es_LA"
            className="logo claro"
            style={{ backgroundImage: "url('imagenes/iconoFacebook.PNG')" }}
          ></Link>
          <Link
            to="https://www.tiktok.com/@librerias.gandhi?lang=es"
            className="logo claro"
            style={{ backgroundImage: "url('imagenes/iconoTickTock.PNG')" }}
          ></Link>
        </div>
      </div>

      <div className="centrado">
        <div className="titulo fuenteClaro">Ubicación</div>
        <p className="fuenteClaro">
          2215 John Daniel Drive
          <br />
          Clark, MO 65243
        </p>
      </div>

      <div>
        <div className="titulo fuenteClaro">Términos y condiciones</div>
        <p className="fuenteClaro derecha">
          Todos los derechos reservados ® librerías DT
        </p>
      </div>
    </div>
  );
};

export default BarraInfo;
