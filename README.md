# Full-Stack Decoupled Monorepo (React + Tailwind CSS & Node.js Express)

Arquitectura modular full-stack desacoplada diseñada con separación estricta de responsabilidades, siguiendo **Feature-Driven Architecture** en el frontend y **Layered Architecture (Controller-Service)** en el backend.

---

## 📁 Estructura del Proyecto

```text
3d-world/
├── .gitignore
├── package.json               # Scripts raíz para orquestación
├── README.md
│
├── client/                    # FRONTEND (React + Vite + Tailwind CSS)
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx           # Punto de entrada de React
│       ├── App.jsx            # Enrutamiento y contenedor raíz
│       ├── index.css          # Directivas de Tailwind y estilos globales
│       ├── components/
│       │   └── ui/            # Componentes atómicos reutilizables (Button, Input, Modal, etc.)
│       ├── features/          # Módulos por dominio de negocio
│       │   ├── auth/          # Componentes, hooks y servicios API de autenticación
│       │   └── products/      # Componentes, hooks y servicios API de productos
│       ├── pages/             # Vistas principales vinculadas a rutas (HomePage, LoginPage)
│       ├── hooks/             # Custom hooks globales compartidos (useLocalStorage)
│       ├── services/          # Cliente HTTP base (Axios / interceptores)
│       └── utils/             # Helpers puros (cn.js para Tailwind, formatters.js)
│
└── server/                    # BACKEND (Node.js + Express)
    ├── .env.example
    ├── package.json
    └── src/
        ├── server.js          # Punto de entrada HTTP y bootstrap de conexiones
        ├── app.js             # Configuración de Express, middlewares y rutas
        ├── config/            # Variables de entorno y conectores (env.js, database.js)
        ├── routes/            # Definición de endpoints y mapeo a controladores
        ├── controllers/       # Manejo de peticiones HTTP, validación y respuestas
        ├── services/          # Lógica de negocio pura e independiente del protocolo
        ├── models/            # Esquemas de datos o acceso a base de datos
        └── middlewares/       # Middlewares globales y de ruta (CORS, JWT, Error Handler)
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Instalación de Dependencias
Puedes instalar las dependencias de ambos proyectos ejecutando desde la raíz:
```bash
npm run install:all
```
O de manera independiente:
```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 2. Variables de Entorno
Copia los archivos `.env.example` a `.env` en cada proyecto:
```bash
# En /client
copy .env.example .env

# En /server
copy .env.example .env
```

### 3. Ejecución en Desarrollo
Desde la raíz del proyecto:
- Frontend solo: `npm run dev:client` (disponible en `http://localhost:3000`)
- Backend solo: `npm run dev:server` (disponible en `http://localhost:5000`)

---

## 🏛️ Patrones Arquitectónicos Implementados

### Frontend: Feature-Driven Architecture
- Los componentes, hooks y llamadas a la API específicos de un dominio de negocio se encuentran auto-contenidos dentro de su respectiva carpeta en `features/<nombre-modulo>/`.
- La carpeta `components/ui/` contiene componentes independientes de dominio (Button, Input, Modal).
- La utilidad `cn()` combina `clsx` y `tailwind-merge` para resolver colisiones de clases en Tailwind CSS.

### Backend: Layered Architecture (Controller-Service-Model)
- **Routes**: Mapean la URL y método HTTP hacia un método específico del controlador.
- **Controllers**: Extraen los datos de la petición (`req.body`, `req.params`, `req.query`), coordinan la llamada a la capa de servicio y devuelven la respuesta HTTP con el código de estado apropiado.
- **Services**: Contienen las reglas de negocio puras, validaciones lógicas y llamadas a modelos. No dependen de objetos `req` ni `res`.
- **Models**: Gestionan las operaciones sobre el almacenamiento de datos.
- **Middlewares**: Capturan errores de forma centralizada (`errorHandler`), protegen rutas privadas mediante JWT (`authMiddleware`) y configuran CORS (`corsMiddleware`).
