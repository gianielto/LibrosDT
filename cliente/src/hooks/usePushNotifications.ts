// import { useState } from "react";

// const usePushNotifications = () => {
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   const subscribe = async (userId: number) => {
//     // Primero verificamos que el navegador soporte SW y Push
//     if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
//       console.warn("Push no soportado en este navegador");
//       return;
//     }

//     // Le pedimos permiso al usuario — esto muestra el popup nativo del navegador
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") return; // el usuario rechazó

//     // Obtenemos el SW activo
//     const registration = await navigator.serviceWorker.ready;

//     // Le pedimos al Push Service una subscription para este usuario
//     // applicationServerKey es tu VAPID public key — el Push Service la usa
//     // para verificar que los mensajes vienen de tu servidor
//     const subscription = await registration.pushManager.subscribe({
//       userVisibleOnly: true, // obligatorio: toda notificación debe mostrarse al usuario
//       applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
//     });

//     // Mandamos la subscription a tu backend para guardarla
//     await fetch(`${import.meta.env.VITE_API_URL}/push/subscribe`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ subscription, userId }),
//     });

//     setIsSubscribed(true);
//   };

//   return { isSubscribed, subscribe };
// };

// export default usePushNotifications;
import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = async (userId: number) => {
    console.log("VAPID:", import.meta.env.VITE_VAPID_PUBLIC_KEY);

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push no soportado");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY,
      ),
    });

    // await fetch(`${import.meta.env.VITE_API_URL}/push/subscribe`, {
    await fetch("http://localhost:4001/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: JSON.parse(JSON.stringify(subscription)),
        userId,
      }),
    });

    setIsSubscribed(true);
  };

  return { isSubscribed, subscribe };
};

export default usePushNotifications;
