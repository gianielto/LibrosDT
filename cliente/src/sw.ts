// /// <reference lib="webworker" />
// import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

// declare const self: ServiceWorkerGlobalScope;

// precacheAndRoute(self.__WB_MANIFEST);
// cleanupOutdatedCaches();

// // Este evento se dispara cuando tu backend manda una notificación
// self.addEventListener("push", (event) => {
//   if (!event.data) return;

//   const data = event.data.json();

//   // Mostramos la notificación con la API nativa del sistema operativo
//   event.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.body,
//       icon: "/imagenes/icon-192.png", // tu ícono
//       badge: "/imagenes/icon-192.png",
//     }),
//   );
// });

// // Este evento se dispara cuando el usuario toca la notificación
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   // Abre o enfoca tu app cuando el usuario toca la notificación
//   event.waitUntil(self.clients.openWindow("/"));
// });
/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Push event
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/imagenes/icon-192.png",
      badge: "/imagenes/icon-192.png",
    }),
  );
});

// Click en notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(self.clients.openWindow("/"));
});
