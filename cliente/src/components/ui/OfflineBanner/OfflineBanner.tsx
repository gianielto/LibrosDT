import useOnlineStatus from "../../../hooks/useOnlineStatus";
import "./OfflineBanner.css";

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  // Si hay conexión, no renderizamos nada
  if (isOnline) return null;

  return (
    <div className="offline-banner" role="alert" aria-live="assertive">
      Sin conexión — mostrando contenido guardado
    </div>
  );
};

export default OfflineBanner;
