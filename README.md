# POS System — Frontend

Interfaz web de un sistema de **Punto de Venta (POS)** desarrollada con **Angular** y **Tailwind CSS**. Incluye login con roles, dashboard con métricas, punto de venta, inventario, clientes y gestión de usuarios, con un diseño moderno e íconos.

> Backend del proyecto: [POS-System-backend](https://github.com/jeanfrancochamorro2006-jpg/POS-System-backend)

---

## 🚀 Tecnologías

- **Angular 21** (standalone components + signals)
- **Tailwind CSS 4**
- **Lucide Angular** (íconos)
- **TypeScript**
- Autenticación con **JWT** (interceptor + guards)

---

## ✨ Funcionalidades

- 🔐 **Login** con JWT y control de acceso por rol (ADMIN / CAJERO)
- 📊 **Dashboard** con tarjetas de métricas, gráfico de ingresos por método de pago y ventas recientes
- 🛒 **Punto de venta**: catálogo, carrito, cálculo de total y cobro
- 📦 **Productos / Inventario** con buscador y badges de stock
- 🏷️ **Categorías** (solo administrador)
- 🧑 **Clientes**
- 🧾 **Historial de ventas** con detalle
- 👥 **Gestión de usuarios** (solo administrador)
- 🎨 Diseño responsive con sidebar de íconos y componentes reutilizables

---

## 📋 Requisitos previos

- **Node.js 18+** y **npm**
- El [backend](https://github.com/jeanfrancochamorro2006-jpg/POS-System-backend) corriendo en `http://localhost:8080`

---

## ⚙️ Instalación

```bash
npm install
```

---

## ▶️ Ejecución

```bash
npm start
```

La aplicación queda disponible en **http://localhost:4200**.

### Credenciales de prueba

| Usuario  | Contraseña  | Rol     |
|----------|-------------|---------|
| `admin`  | `admin123`  | ADMIN   |
| `cajero` | `cajero123` | CAJERO  |

> La URL del backend se configura en [`src/app/core/models.ts`](src/app/core/models.ts) (constante `API_URL`).

---

## 🏗️ Build de producción

```bash
npm run build
```

Los archivos compilados se generan en `dist/`.

---

## 🗂️ Estructura

```
src/app/
├── core/        # Servicios, modelos, guards, interceptor, íconos
├── layout/      # Layout principal (sidebar + topbar)
└── pages/       # Login, dashboard, ventas, productos, categorías,
                 # clientes, historial, usuarios
```

---

## 📝 Licencia

Proyecto académico de desarrollo web.
