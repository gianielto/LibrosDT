# 📚 Libros DT — Fullstack Book E-commerce

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

---

## Descripción

**Libros DT** es una plataforma de e-commerce fullstack para venta de libros, construida con un enfoque en seguridad real, arquitectura desacoplada y buenas prácticas de ingeniería de software.

El objetivo no fue solo hacer que funcione — sino construirlo como lo haría un sistema en producción.

---

## 🏗️ Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────┐
│                    Cliente (Vercel)                   │
│              React SPA + TypeScript                   │
│         Context API · React Router · Fetch API        │
└─────────────────────────┬────────────────────────────┘
                          │ HTTPS + HTTPOnly Cookie
                          ▼
┌──────────────────────────────────────────────────────┐
│                   API REST (Render)                   │
│              Node.js + Express + TypeScript           │
│         Controllers · Routes · Middleware JWT         │
└─────────────────────────┬────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────┐
│                   Prisma ORM                          │
│                  PostgreSQL DB                        │
└──────────────────────────────────────────────────────┘
```

**Decisiones de diseño clave:**
- Frontend y backend completamente desacoplados → deploy y escalado independiente
- API stateless → facilita escalado horizontal
- Autenticación centralizada via middleware
- Estructura backend en capas: controllers / routes / middleware

---

## 🔐 Sistema de Autenticación

Se implementó una estrategia de **autenticación basada en cookies HTTPOnly**, alineada con estándares modernos de seguridad web.

### ¿Por qué cookies y no localStorage?

| Aspecto       | Cookies HTTPOnly ✅ | localStorage ❌ |
|---------------|---------------------|-----------------|
| Protección XSS | Inaccesible desde JS | Expuesto a scripts |
| Envío automático | Sí, en cada request | Manual |
| Nivel de seguridad | Alto | Bajo |

### Flujo de autenticación

```
Login (POST /auth/login)
        │
        ▼
  Validar credenciales
        │
        ▼
  Generar JWT (servidor)
        │
        ▼
  Almacenar en cookie HTTPOnly
        │
        ▼
  Requests posteriores incluyen cookie automáticamente
        │
        ▼
  Middleware valida token → acceso autorizado
```

### Medidas de seguridad implementadas

- 🍪 Cookies HTTPOnly (inaccesibles desde JavaScript)
- 🔒 Configuración `sameSite: none` + `secure: true` para entornos cross-origin
- ⏱️ Expiración de JWT
- 🔑 Hashing de contraseñas con bcrypt
- 🛡️ Manejo centralizado de errores

---

## 📦 Funcionalidades

**Usuarios**
- Registro, login y logout
- Persistencia de sesión via `/auth/me`
- Rutas protegidas en el frontend

**E-commerce**
- Catálogo de libros
- Carrito de compras
- UI condicional según estado de autenticación

---

## 📂 Estructura del Proyecto

```
LibrosDT/
├── cliente/                  # Frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/          # Estado global de autenticación
│       ├── hooks/
│       └── utils/
│
└── backend/                  # API REST
    └── src/
        ├── controllers/
        ├── routes/
        ├── middleware/       # Validación JWT
        ├── prisma/           # Schema y migraciones
        └── lib/
```

---

## ⚙️ Instalación local

### Requisitos

- Node.js v18+
- PostgreSQL

### 1. Clonar el repositorio

```bash
git clone https://github.com/gianielto/LibrosDT.git
cd LibrosDT
```

### 2. Backend

```bash
cd backend
npm install
```

Crea un `.env`:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
NODE_ENV=development
```

```bash
npx prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd cliente
npm install
```

Crea un `.env`:

```env
VITE_API_URL=http://localhost:4001
```

```bash
npm run dev
```

---

## 🧩 Problemas técnicos resueltos

### CORS + Cookies entre dominios
**Problema:** Las cookies no se enviaban entre dominios distintos (Vercel ↔ Render).  
**Solución:** `credentials: true` en la configuración de CORS del backend + cookies con `sameSite: none` y `secure: true`.

### Persistencia de sesión tras recarga
**Problema:** El estado del usuario se perdía al recargar la página.  
**Solución:** Endpoint `/auth/me` que verifica la cookie activa al montar la app + estado global con Context API.

### Exposición del token
**Problema:** Almacenar el JWT en localStorage lo expone a ataques XSS.  
**Solución:** JWT almacenado exclusivamente en cookies HTTPOnly, inaccesibles desde JavaScript.

---

## 🗺️ Roadmap

- [ ] Refresh Token strategy (tokens de corta duración)
- [ ] Autorización por roles (RBAC)
- [ ] Integración de pagos (Stripe)
- [ ] Almacenamiento de imágenes (Cloudinary / S3)
- [ ] Capa de caché (Redis)
- [ ] Testing automatizado (Jest + Supertest)
- [ ] CI/CD pipelines

---

## 👤 Autor

**Daniel Torres** — Estudiante de Ingeniería Informática, CUCEI (UDG)  
Enfocado en backend, arquitecturas escalables y desarrollo fullstack.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dantocru/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/gianielto)
