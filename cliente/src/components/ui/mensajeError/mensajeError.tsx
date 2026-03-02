import { useEffect } from "react";
import "./mensajeError.css";

interface MensajeErrorProps {
  mensaje: string;
  duracion?: number;
  onClose: () => void;
}

const MensajeError: React.FC<MensajeErrorProps> = ({
  mensaje,
  duracion = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (!mensaje) return;

    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [mensaje, duracion, onClose]);

  if (!mensaje) return null;

  return <div className="mensaje-error">{mensaje}</div>;
};

export default MensajeError;
