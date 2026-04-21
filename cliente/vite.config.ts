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
//               urlPattern: ({ url }) =>
//                 url.href.startsWith(
//                   (env.VITE_API_URL as string) || "=http://localhost:4001",
//                 ),
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
//revisar el error del sw en el navegador repitiendo los comando npm run build y npm run preview para ver el error del sw en el navegador y corregirlo.
//posiblemente se deba a la configuración del VitePWA o a la forma en que se están manejando las rutas de la API en el service worker. Asegúrate de que la URL de la API esté correctamente configurada y que el patrón de URL en el runtimeCaching coincida con las solicitudes que estás haciendo desde tu aplicación.
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     react(),

//     VitePWA({
//       registerType: "autoUpdate",

//       includeAssets: ["vite.svg", "imagenes/**/*"],

//       manifest: {
//         name: "Mi App",
//         short_name: "App",
//         start_url: "/",
//         display: "standalone",
//         background_color: "#ffffff",
//         theme_color: "#ffffff",
//         icons: [
//           {
//             src: "imagenes/icons/icon-192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "imagenes/icons/icon-512.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//         ],
//       },

//       workbox: {
//         cleanupOutdatedCaches: true,

//         runtimeCaching: [
//           // 🔴 API (SIN usar env)
//           {
//             urlPattern: ({ url }) => url.origin === "http://localhost:4001", // 👈 CAMBIA ESTO
//             handler: "NetworkFirst",
//             options: {
//               cacheName: "api-cache",
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 60 * 60 * 24, // 1 día
//               },
//             },
//           },

//           // 🟢 IMÁGENES
//           {
//             urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
//             handler: "CacheFirst",
//             options: {
//               cacheName: "images-cache",
//               expiration: {
//                 maxEntries: 100,
//                 maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
//               },
//             },
//           },
//         ],
//       },
//     }),
//   ],
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",

        // Usamos TU sw.ts — Vite inyecta el precache dentro de él
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.ts",

        injectManifest: {
          swSrc: "src/sw.ts",
          // Las estrategias de runtime van aquí con injectManifest
          rollupFormat: "iife",
        },

        includeAssets: ["imagenes/**/*"],

        // false porque ya tienes tu propio manifest.json en public/
        manifest: false,

        workbox: {
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.href.startsWith(env.VITE_API_URL),
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24,
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
  };
});
