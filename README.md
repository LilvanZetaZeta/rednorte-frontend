# RedNorte - Frontend Portal

El frontend de **RedNorte** es una aplicación de página única (SPA) modular e intuitiva, desarrollada en **React** con **TypeScript** y **TailwindCSS**. Permite la interacción de todos los actores del sistema (Pacientes, Médicos, Secretarias, Administradores y Directores).

## Características Principales

*   **Portal de Pacientes**: Agendamiento de citas, visualización del historial médico, y aceptación/rechazo de ofertas de reasignación rápidas.
*   **Portal de Médicos**: Gestión de agenda del día, bloqueo de agenda, registro de observaciones clínicas e historial de citas.
*   **Portal de Secretarias**: Agendamiento prioritario para pacientes, registro de nuevos pacientes y bloqueo de agenda.
*   **Portal de Administradores/Directores**: Gestión del staff del centro médico (médicos y secretarias), asignación de especialidades y visualización de métricas de sucursal.
*   **Integración con RTK Query**: Consultas y mutaciones eficientes al backend a través de la API Gateway.
*   **Diseño Responsivo**: Adaptado para dispositivos móviles y de escritorio.

## Estructura del Código

La estructura de carpetas implementa el patrón **MVVM** (Model-View-ViewModel):
*   `src/components`: Componentes UI reutilizables estructurados según Atomic Design (átomos, moléculas, organismos, plantillas).
*   `src/views`: Páginas del portal y flujos principales de pantallas.
*   `src/viewmodels`: Hooks personalizados de React que controlan el estado y la lógica de negocio de las vistas.
*   `src/services`: Definición de endpoints y peticiones de Redux Toolkit Query contra el API Gateway.
*   `src/utils`: Validaciones globales de formularios y funciones de asistencia.
*   `src/config`: Inicialización de clientes (ej. Supabase Client).

## Tecnologías Utilizadas

*   **React 18**
*   **TypeScript**
*   **Vite** (Build Tool y Servidor de Desarrollo)
*   **TailwindCSS** (Estilos y Diseño Responsivo)
*   **Redux Toolkit & RTK Query** (Gestión de Estado y caché de APIs)
*   **Supabase Auth** (Registro y Autenticación del Paciente)
*   **Lucide React** (Iconografía)

## Requisitos Previos

*   **Node.js** v18 o superior.
*   **pnpm** o **npm** para instalar dependencias.

## Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto frontend con la siguiente estructura de variables (reemplaza los valores entre `<>` con tus configuraciones correspondientes):

```env
# URL de la instancia de Supabase (ej: https://<project-id>.supabase.co)
VITE_SUPABASE_URL=<url_proyecto_supabase>

# Clave pública anónima de Supabase (Anon Key) para autenticación de clientes
VITE_SUPABASE_ANON_KEY=<anon_key_supabase>

# Ruta base local o gateway relativo para peticiones API
VITE_GATEWAY_URL=/api

# URL de la API Gateway (o /api para redireccionamiento por proxy/Nginx)
VITE_API_GATEWAY_URL=/api
```

## Instrucciones de Ejecución

### 1. Instalar Dependencias

```bash
npm install
# o con pnpm
pnpm install
```

### 2. Ejecutar en Modo Desarrollo

Levanta el servidor local en `http://localhost:5173`:

```bash
npm run dev
# o con pnpm
pnpm dev
```

### 3. Construir para Producción

Compila los recursos optimizados en la carpeta `dist`:

```bash
npm run build
# o con pnpm
pnpm build
```

## Dockerización

Construir la imagen Docker basada en Nginx para servir la aplicación compilada:

```bash
docker build -t rednorte-frontend .
```
