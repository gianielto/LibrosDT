// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig(({ mode }) => {
//   // Cargamos las variables de entorno según el modo (development/production)
//   const env = loadEnv(mode, process.cwd(), "");

//   return {
//     plugins: [
//       react(),
//       VitePWA({
//         registerType: "autoUpdate",
//         includeAssets: ["**/*"],
//         manifest: false,

//         workbox: {
//           runtimeCaching: [
//             {
//               // Usamos la URL del .env para que funcione en local Y en producción
//               urlPattern: ({ url }) => url.href.startsWith(env.VITE_API_URL as string || "https://tu-backend.onrender.com"),
//               handler: "NetworkFirst",
//               options: {
//                 cacheName: "api-cache",
//                 expiration: {
//                   maxEntries: 50,
//                   maxAgeSeconds: 60 * 60 * 24,
//                 },
//               },
//             },
//             {
//               urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
//               handler: "CacheFirst",
//               options: {
//                 cacheName: "images-cache",
//                 expiration: {
//                   maxEntries: 100,
//                   maxAgeSeconds: 60 * 60 * 24 * 30,
//                 },
//               },
//             },
//           ],
//         },
//       }),
//     ],
//   };
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), "");

  // Guardamos la URL de la API en una constante (IMPORTANTE)
  const apiUrl = env.VITE_API_URL || "";

  return {
    plugins: [
      react(),

      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["**/*"],

        // Puedes dejar manifest aquí o usar uno externo en /public
        manifest: false,

        workbox: {
          runtimeCaching: [
            // 🔴 CACHE API (CORREGIDO)
            {
              urlPattern: new RegExp(`^${apiUrl}`),
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 1 día
                },
              },
            },

            // 🟢 CACHE IMÁGENES
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
                },
              },
            },
          ],
        },
      }),
    ],
  };
});
//revisar el error del sw en el navegador repitiendo los comando npm run build y npm run preview para ver el error del sw en el navegador y corregirlo.
//posiblemente se deba a la configuración del VitePWA o a la forma en que se están manejando las rutas de la API en el service worker. Asegúrate de que la URL de la API esté correctamente configurada y que el patrón de URL en el runtimeCaching coincida con las solicitudes que estás haciendo desde tu aplicación.
