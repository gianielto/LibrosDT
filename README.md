

---

# 📚 LibrosDT — E-commerce de Libros

> Plataforma de e-commerce para la venta de libros, con tienda pública para clientes y panel de administración para gestión de inventario y pedidos.
<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Demo-librosdt.vercel.app-black?style=for-the-badge)](https://librosdt.vercel.app)
[![API](https://img.shields.io/badge/🔌_API-onrender.com-6366f1?style=for-the-badge)](https://librosdt-api.onrender.com)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

</div>
**Demo en producción → [librosdt.vercel.app](https://librosdt.vercel.app/)**

---

## 📋 Tabla de contenidos

- [Descripción general](#descripción-general)
- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Funcionalidades PWA](#funcionalidades-pwa)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Instalación local](#instalación-local)
- [Autor](#autor)

---

## 📖 Descripción general

**LibrosDT** es una aplicación web fullstack tipo e-commerce orientada a la venta de libros. Cuenta con dos interfaces diferenciadas:

- **Tienda pública (`/cliente`)** — donde los clientes pueden explorar el catálogo, filtrar por categorías y autores, gestionar su carrito y realizar pedidos.
- **Panel de administración (`/admin-client`)** — donde los empleados y administradores gestionan el inventario, supervisan pedidos y monitorean el estado general del negocio a través de un dashboard.

La aplicación está construida sobre el stack **PERN** (PostgreSQL, Express, React, Node.js) con **Prisma** como ORM, y está configurada como **Progressive Web App (PWA)**, lo que permite su instalación en dispositivos móviles y uso offline parcial.

---

## ✨ Funcionalidades

### 🛍️ Tienda pública
- Catálogo de libros con filtrado por categoría y autor
- Vista de detalle de producto
- Carrito de compras persistente
- Registro e inicio de sesión de clientes (JWT + bcrypt)
- Notificaciones push para clientes autenticados
- Banner de estado offline (PWA)
- Instalable como app en dispositivos móviles (PWA)

### 🛠️ Panel de administración
- Dashboard con métricas: stock bajo, estado de pedidos y resumen general
- CRUD completo de productos (libros), categorías, editoriales y autores
- Gestión y seguimiento de pedidos
- Carga de imágenes de productos vía **Cloudinary**
- Autenticación separada para empleados/administradores

---

## 🧰 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend (tienda) | React + TypeScript + Vite |
| Frontend (admin) | React + TypeScript + Vite + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma |
| Autenticación | JWT + bcrypt |
| Imágenes | Cloudinary |
| PWA | vite-plugin-pwa |
| Despliegue frontend | Vercel |
| Despliegue backend | Render |
| Base de datos cloud | Neon |

---

## 🗂️ Arquitectura del proyecto

El repositorio está organizado como un **monorepo** con tres paquetes independientes:

```
LibrosDT/
├── backend/          # API REST (Express + Prisma)
├── cliente/          # Tienda pública (React + Vite + PWA)
└── admin-client/     # Panel de administración (React + Vite)
```

### Backend (`/backend`)

```
src/
├── controllers/      # Lógica de negocio por entidad
│   └── admin/        # Controladores exclusivos del panel admin
├── routes/           # Definición de endpoints
├── middleware/        # Auth middleware (cliente y admin)
├── services/         # Servicios reutilizables (carrito)
├── lib/              # Clientes de Prisma y Cloudinary
├── types/            # Extensiones de tipos Express
└── index.ts          # Entry point del servidor
prisma/
└── schema.prisma     # Modelo de datos completo
```

**Modelos principales del schema:**

| Modelo | Descripción |
|---|---|
| `clientes` | Usuarios de la tienda pública |
| `empleados` | Staff con acceso al panel admin |
| `productos` | Inventario de libros |
| `categorias` / `editoriales` / `autores` | Catálogos de clasificación |
| `pedidos` / `pedidos_productos` | Órdenes de compra |
| `promociones` | Banners y promociones activas |
| `push_subscriptions` | Suscripciones a notificaciones push |

### Cliente — Tienda pública (`/cliente`)

```
src/
├── components/       # UI reutilizable (NavBar, carrito, banners, etc.)
├── context/          # Gestión de sesión con Context API
├── hooks/            # useOnlineStatus, usePushNotifications
├── pages/            # Vistas principales
├── routes/           # ProtectedRoute y PublicRoute
├── services/         # Llamadas a la API (axios)
└── sw.ts             # Service Worker personalizado
public/
├── manifest.json     # Web App Manifest (PWA)
└── imagenes/icons/   # Iconos PWA (192px y 512px)
```

### Admin (`/admin-client`)

```
src/
├── components/       # Modales, tablas, layout del panel
├── pages/            # Dashboard, Productos, Clientes, Pedidos
├── store/            # Estado de autenticación admin (Zustand)
└── types/            # Tipos globales del panel
```

---

## 📱 Funcionalidades PWA

LibrosDT está configurada como Progressive Web App con las siguientes capacidades:

| Característica | Implementación |
|---|---|
| **Instalable** | `manifest.json` con íconos 192px y 512px, colores de marca |
| **Service Worker** | `vite-plugin-pwa` con estrategia `injectManifest` |
| **Caché de red** | `NetworkFirst` para llamadas a la API |
| **Caché de imágenes** | `CacheFirst` para assets estáticos |
| **Estado offline** | Hook `useOnlineStatus` + componente `OfflineBanner` en NavBar |
| **Notificaciones push** | VAPID keys, suscripción por cliente, rutas `/push/subscribe` y `/push/notify/:userId` |

La `OfflineBanner` se muestra automáticamente en la NavBar cuando el usuario pierde conexión, utilizando los colores de la marca de la librería.

Las notificaciones push están disponibles únicamente para clientes autenticados, con un botón `BellButton` visible en la NavBar tras el inicio de sesión.

---

## 📸 Capturas de pantalla

### Tienda pública

| Home — Catálogo | Detalle de producto |
|---|---|
| ![Home](/.github/assets/home.png) | ![Detalle](/.github/assets/detalle.png) |

| Carrito de compras | |
|---|---|
| ![Carrito](/.github/assets/carrito.png) | |

### Panel de administración

| Gestión de productos | Dashboard |
|---|---|
| ![Productos Admin](/.github/assets/admin-productos.png) | ![Dashboard](/.github/assets/admin-dashboard.png) |

---

## 🚀 Instalación local

### Requisitos previos

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL (o cuenta en [Neon](https://neon.tech))
- Cuenta en [Cloudinary](https://cloudinary.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/gianielto/librosdt.git
cd librosdt
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` en `/backend`:

```env
DATABASE_URL=postgresql://usuario:contraseña@host/db?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://usuario:contraseña@host/db?sslmode=require

JWT_SECRET=tu_secreto_jwt

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

VAPID_PUBLIC_KEY=tu_vapid_public_key
VAPID_PRIVATE_KEY=tu_vapid_private_key
VAPID_EMAIL=mailto:tu@email.com
```

Ejecutar migraciones y levantar el servidor:

```bash
npx prisma migrate deploy
npm run dev
```

### 3. Configurar la Tienda pública

```bash
cd ../cliente
npm install
```

Crear el archivo `.env` en `/cliente`:

```env
VITE_API_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=tu_vapid_public_key
```

```bash
npm run dev
```

### 4. Configurar el Panel de administración

```bash
cd ../admin-client
npm install
```

Crear el archivo `.env` en `/admin-client`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

### 5. Acceder a la aplicación

| Servicio | URL local |
|---|---|
| Tienda pública | `http://localhost:5173` |
| Panel de administración | `http://localhost:5174` |
| API Backend | `http://localhost:3000` |

---

## 🌐 Despliegue en producción

| Servicio | Plataforma |
|---|---|
| Tienda pública | [Vercel](https://vercel.com) |
| Panel de administración | [Vercel](https://vercel.com) |
| Backend API | [Render](https://render.com) |
| Base de datos | [Neon](https://neon.tech) |
| Imágenes | [Cloudinary](https://cloudinary.com) |

---

## 👤 Autor

**Daniel Torres**
GitHub: [@gianielto](https://github.com/gianielto)

---

*LibrosDT — Desarrollado con ❤️ y PERN Stack*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dantocru/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/gianielto)
