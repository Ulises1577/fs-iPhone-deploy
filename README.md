# 📱 Cupertino Cellular — Tienda de Celulares (Full-Stack CRUD)

Plataforma web moderna y minimalista de comercio electrónico y gestión de inventario para una **Tienda de Venta de Celulares**, desarrollada con arquitectura monorepo, catálogo público, operaciones **CRUD completas**, diseño **Cupertino Studio (Apple-inspired Minimalist Purism & Frosted Glassmorphism)** y preparada para despliegue en **Railway (Backend + PostgreSQL)** y **Netlify (Frontend)**.

---

## 🏛️ 1. Arquitectura y Stack Tecnológico

### 🖥️ Frontend (`/frontend`)
- **Framework:** React 18+ con Vite.
- **Estilos:** Tailwind CSS configurado con el sistema de diseño **Cupertino Studio**:
  - Paleta Apple: Interaction Blue (`#0071E3`), Obsidian Noir (`#1D1D1F`), Slate (`#86868B`), Canvas Fog (`#F5F5F7`), Pure White (`#FFFFFF`).
  - Efectos: Vidrio esmerilado con `backdrop-filter: blur(20px) saturate(180%)`, bordes ultra-finos (Hairline `0.08`), y relieve óptico interior.
  - Tipografía: Inter afinada a SF Pro (tracking negativo en display y positivo en micro-etiquetas).
  - Componentes:
    - Barra de navegación con buscador en tiempo real y selector segmentado de vistas.
    - Cuadrícula de tarjetas de catálogo (*Showcase Reel*) con fotografía flotante y badges de stock.
    - Tabla de gestión de inventario (*CRUD Matrix Table*) con filas alternadas y acciones rápidas.
    - Modal de creación y edición con vista previa de imagen en vivo y atajos con 1 clic (*Presets*).
    - Diálogo de confirmación destructivo para eliminar de forma segura.
    - Modal de ficha técnica completa (especificaciones, memoria, procesador, fechas).
    - Notificaciones tipo píldora flotante (*Toasts*).
- **Cliente HTTP:** `fetch` nativo encapsulado en `src/services/celularesService.js`.
- **Despliegue:** **Netlify**.

### ⚙️ Backend (`/backend`)
- **Entorno:** Node.js (v20+ ES Modules, `"type": "module"`).
- **Framework:** Express.js (`express`, `cors`, `dotenv`).
- **Base de Datos:** PostgreSQL con cliente `pg` (`Pool`).
- **Esquema e Inicialización:**
  - Archivo `backend/src/db/init.sql` con DDL y validaciones de rango (`CHECK (precio >= 0)`, `CHECK (almacenamiento_gb > 0)`, etc.).
  - Inicialización automática al arrancar el servidor (`backend/src/db/init.js`), verificando la tabla y poblando datos semilla si está vacía.
- **Validaciones & Seguridad:**
  - Middleware de validación estricto (`validateCelular.js`) con mensajes de error y respuestas 100% en español.
  - Endpoints RESTful con búsqueda multicriterio (`marca`, `modelo`, `color`), filtros de precio, ordenamiento dinámico y métricas.
- **Despliegue:** **Railway** (junto al servicio de base de datos PostgreSQL de Railway).

---

## 🗄️ 2. Esquema de Base de Datos PostgreSQL

```sql
CREATE TABLE IF NOT EXISTS celulares (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(150) NOT NULL,
  precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  almacenamiento_gb INTEGER NOT NULL CHECK (almacenamiento_gb > 0),
  ram_gb INTEGER NOT NULL CHECK (ram_gb > 0),
  color VARCHAR(50),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  descripcion TEXT,
  imagen_url TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 3. Guía de Despliegue en Producción

### A. Despliegue del Backend y Base de Datos en Railway

1. **Crear proyecto en Railway:**
   - Ingresa a [railway.app](https://railway.app/) e inicia sesión.
   - Crea un nuevo proyecto (**"New Project"**).

2. **Crear la base de datos PostgreSQL:**
   - En tu proyecto de Railway, haz clic en **"New" -> "Database" -> "Add PostgreSQL"**.
   - Railway aprovisionará la base de datos y generará la variable `DATABASE_URL` automáticamente.

3. **Desplegar el Backend:**
   - Haz clic en **"New" -> "GitHub Repo"** y selecciona este repositorio (`fs-iPhone-deploy`).
   - Entra en los **Settings** del servicio recién creado:
     - **Root Directory:** Configúralo como `/backend` (o déjalo en raíz si usa `railway.json`).
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
   - En la pestaña **Variables**:
     - Agrega la variable de referencia `DATABASE_URL` conectada al PostgreSQL de Railway (o copia el Connection String del servicio PostgreSQL: `${{Postgres.DATABASE_URL}}`).
     - Agrega `PORT=3000` (o permite que Railway asigne el puerto dinámico).
     - Agrega `NODE_ENV=production`.
   - En la pestaña **Settings -> Networking**:
     - Haz clic en **"Generate Domain"** para obtener tu URL pública (ejemplo: `https://tu-backend-production.up.railway.app`).
   - Verifica el funcionamiento ingresando en el navegador a: `https://tu-backend-production.up.railway.app/api/health`. Debe responder con estado operativo.

---

### B. Despliegue del Frontend en Netlify

1. **Importar repositorio en Netlify:**
   - Ingresa a [netlify.com](https://www.netlify.com/) e inicia sesión.
   - Haz clic en **"Add new site" -> "Import an existing project" -> "GitHub"**.
   - Selecciona este repositorio (`fs-iPhone-deploy`).

2. **Configurar Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist` (o `frontend/dist`)
   *(El archivo `netlify.toml` ya incluye estas configuraciones y la regla de redirección SPA `/* -> /index.html 200`)*.

3. **Variables de Entorno en Netlify:**
   - En **Site configuration -> Environment variables**, añade:
     - **Key:** `VITE_API_URL`
     - **Value:** La URL de tu backend en Railway con el sufijo `/api` (ejemplo: `https://tu-backend-production.up.railway.app/api`).

4. **Desplegar:**
   - Haz clic en **"Deploy site"**.
   - Netlify compilará los assets de Vite y publicará la tienda con soporte completo de rutas y conexión al backend.

---

## 💻 4. Ejecución en Entorno Local

### Prerrequisitos
- Node.js v20 o superior.
- PostgreSQL local o una instancia remota (Neon, Supabase, Railway).

### Paso 1: Configurar el Backend
```bash
cd backend
npm install

# Copia el archivo de variables de entorno y ajusta las credenciales
cp .env.example .env
```
Edita `backend/.env` con tu cadena de conexión:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/tienda_celulares
```

Inicia el backend en modo desarrollo:
```bash
npm run dev
```
*(Al iniciar por primera vez, el backend crea automáticamente la tabla `celulares` y la carga con 6 dispositivos insignia de muestra).*

### Paso 2: Configurar el Frontend
En otra terminal:
```bash
cd frontend
npm install

# Inicia el servidor de desarrollo de Vite
npm run dev
```
Abre en tu navegador `http://localhost:5173`. ¡Listo! El proxy de Vite enviará automáticamente las peticiones de `/api/*` al backend en el puerto 3000.

---

## 📡 5. Referencia de Endpoints de la API REST

Todos los mensajes y respuestas se emiten en español y con formato JSON estándar:

| Método | Endpoint | Descripción | Parámetros Opcionales / Cuerpo |
|---|---|---|---|
| `GET` | `/api/health` | Estado del servicio | — |
| `GET` | `/api/celulares` | Obtener catálogo | `?search=...&marca=...&minPrecio=...&maxPrecio=...&orden=...` |
| `GET` | `/api/celulares/:id` | Obtener un celular por ID | Parámetro `id` |
| `POST` | `/api/celulares` | Crear un nuevo celular | Body JSON con campos requeridos |
| `PUT` | `/api/celulares/:id` | Actualizar celular existente | Parámetro `id` + Body JSON |
| `DELETE` | `/api/celulares/:id` | Eliminar celular | Parámetro `id` |
| `GET` | `/api/celulares/marcas` | Lista de marcas existentes | — |
| `GET` | `/api/celulares/estadisticas` | Métricas generales del inventario | — |

### Ejemplo de Cuerpo JSON (`POST` / `PUT`):
```json
{
  "marca": "Apple",
  "modelo": "iPhone 16 Pro Max",
  "precio": 1499.00,
  "almacenamiento_gb": 256,
  "ram_gb": 8,
  "color": "Titanio Desierto",
  "stock": 15,
  "descripcion": "Diseño en titanio de grado aeroespacial con chip A18 Pro.",
  "imagen_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
}
```

---

## 🎨 6. Características del Sistema de Diseño (Cupertino Studio)

- **Filtros por Marca y Ordenación Dinámica:** Selector segmentado con pills tipo Apple.
- **Doble Modo de Visualización:**
  - **Catálogo (Cards Showcase):** Enfoque cinema-grade con fotografía flotante y relieve óptico.
  - **Inventario (CRUD Matrix Table):** Cabecera sticky de vidrio esmerilado con micro-labels para gestión rápida.
- **Asistente de Carga Rápida (Presets):** Botones con 1 clic para autocompletar modelos insignia (iPhone 16 Pro Max, S24 Ultra, Pixel 9 Pro) y probador de fotos en vivo.
- **Alertas y Confirmaciones Seguras:** Modal con estética destructiva para prevenir borrados accidentales y banners tipo Toast para confirmación de cambios.
