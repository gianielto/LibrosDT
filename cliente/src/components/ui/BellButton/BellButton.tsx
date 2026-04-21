import { useEffect, useState } from "react";
import usePushNotifications from "../../../hooks/usePushNotifications";
import { useAuth } from "../../../context/useAuth";
import "./BellButton.css";

const BellButton = () => {
  const { user } = useAuth();
  const { isSubscribed, subscribe } = usePushNotifications();
  const [permissionState, setPermissionState] =
    useState<NotificationPermission>("default");

  // Al montar verificamos si el usuario ya había dado permiso antes
  useEffect(() => {
    if ("Notification" in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  // Si el navegador no soporta notificaciones, no mostramos nada
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return null;
  }

  // Si ya rechazó, mostramos la campana tachada sin click
  // El navegador bloquea volver a pedir permiso — hay que ir a configuración
  if (permissionState === "denied") {
    return (
      <button
        className="bell-btn bell-btn--denied"
        disabled
        title="Notificaciones bloqueadas en tu navegador"
      >
        🔕
      </button>
    );
  }

  const handleClick = async () => {
    if (!user) return;
    await subscribe(user.id);
    setPermissionState(Notification.permission);
  };

  return (
    <button
      className={`bell-btn ${isSubscribed || permissionState === "granted" ? "bell-btn--active" : ""}`}
      onClick={handleClick}
      title={
        isSubscribed ? "Notificaciones activadas" : "Activar notificaciones"
      }
    >
      {isSubscribed || permissionState === "granted" ? "🔔" : "🔕"}
    </button>
  );
};

export default BellButton;
