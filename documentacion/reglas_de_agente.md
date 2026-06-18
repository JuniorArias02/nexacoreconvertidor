# Reglas de Agente para NexaCore Services

Este documento define las reglas de comportamiento y arquitectura para los agentes de inteligencia artificial y desarrolladores que trabajen en este microservicio. El objetivo es mantener el código limpio, escalable y mantenible a largo plazo.

## 1. Arquitectura y Patrones
- **Domain-Driven Design (DDD)**: El proyecto sigue una arquitectura gritona (Screaming Architecture). La raíz del código fuente se divide por Módulos o Contextos Delimitados (Bounded Contexts), por ejemplo: `Convertidor`.
- **Estructura Interna de Módulos**: Cada módulo debe contener estrictamente tres capas:
  - `Dominio/`: Contiene entidades, objetos de valor y reglas de negocio puras. No tiene dependencias externas.
  - `Aplicacion/`: Contiene los Casos de Uso (Use Cases) que orquestan el flujo de datos.
  - `Infraestructura/`: Contiene los detalles técnicos (Controladores, Rutas, Servicios externos, Base de datos).
- **Clean Architecture**: La dependencia siempre fluye hacia adentro (Infraestructura -> Aplicación -> Dominio). El Dominio nunca depende de Infraestructura.
- **Inyección de Dependencias**: Los Casos de Uso deben recibir sus dependencias (servicios de infraestructura, repositorios) por constructor.

## 2. Convenciones de Código
- **Idioma**: El código debe escribirse estrictamente en **ESPAÑOL**. Esto incluye nombres de variables, funciones, clases, métodos, archivos y carpetas.
- **CamelCase y PascalCase**: 
  - Clases y Archivos que exportan clases: `PascalCase` (Ej. `ConvertirExcelAPdf.js`, `Documento.js`).
  - Funciones, métodos y variables: `camelCase` (Ej. `ejecutar()`, `nombreOriginal`).
- **ES Modules**: Utilizar siempre `import` / `export` ("type": "module" en `package.json`). No utilizar `require()`.

## 3. Prácticas Backend
- **Separación de Responsabilidades**: El archivo principal (e.g. `servidor.js`) solo debe ser el punto de entrada para arrancar el servidor. La configuración de Express, middlewares (CORS) y rutas deben estar separados en archivos modulares de configuración.
- **Manejo de Archivos**: Al trabajar con archivos, procesarlos en memoria (buffers) siempre que sea posible para evitar escribir basura en el disco del servidor.

## 4. Seguridad y Robustez
- **Seguridad por Defecto**: Todo nuevo endpoint debe estar respaldado por políticas de seguridad básicas (uso de `helmet` para cabeceras HTTP, y `express-rate-limit` para evitar DDoS).
- **Validación de Entradas**: Ningún dato proveniente del cliente (Body, Params, Query) debe ser confiado. Toda entrada debe ser validada en la capa de Infraestructura antes de pasar a los Casos de Uso (Aplicación).
- **Manejo de Variables de Entorno**: Nunca "hardcodear" credenciales, puertos, orígenes CORS ni secretos. Todo debe leerse desde `process.env`. Si agregas una nueva variable, debes añadirla obligatoriamente al archivo `.env.example`.

## 5. Respuestas HTTP y Manejo de Errores
- **Formato Estándar de Respuesta**: Todas las respuestas de la API deben mantener una estructura predecible. Por ejemplo: `{ "exito": true/false, "datos": {...}, "mensaje": "..." }`.
- **Manejo Centralizado de Errores**: Nunca exponer el `stack trace` o errores internos del servidor al cliente en producción. Utilizar bloques `try/catch` en los Controladores y retornar códigos HTTP semánticos (400 Bad Request, 404 Not Found, 500 Internal Server Error).
- **Errores de Dominio**: Lanzar excepciones personalizadas de negocio desde el Dominio y la Aplicación, y dejar que la capa de Infraestructura las traduzca a respuestas HTTP.

## 6. Documentación de la API
- **Swagger / OpenAPI**: Todo nuevo endpoint (ruta) creado en los controladores debe ir acompañado de su respectiva documentación con anotaciones JSDoc (`@swagger`) directamente encima de la declaración de la ruta.
- La documentación en Swagger debe incluir siempre: resumen, descripción, parámetros/body requeridos y los posibles códigos de respuesta HTTP (200, 400, 500).

## 7. Rendimiento y Concurrencia (Conversiones)
- **No bloquear el Event Loop**: Node.js es monohilo. Al ejecutar procesos pesados del sistema operativo (como conversiones de LibreOffice a PDF), estas operaciones deben ser siempre asíncronas (`async/await` y Promesas).
- **Limpieza de Recursos**: Si por alguna razón un archivo debe ser escrito en disco temporalmente para la conversión, el sistema DEBE garantizar su eliminación inmediata (tanto del archivo original como del generado) en un bloque `finally`, ocurra o no un error en el proceso.

## 8. WebSockets y Telemetría
- **Aislamiento**: La lógica de emisión de eventos de telemetría (Socket.io) no debe acoplarse con la lógica pura de negocio. Debe inyectarse como un servicio de infraestructura al caso de uso, respetando el principio de Inversión de Dependencias.

## 9. Despliegue y Ejecución
- **Entorno de Producción**: El microservicio está diseñado para correr detrás de un administrador de procesos (como PM2 o Servicios de Windows) apuntando al archivo principal (`src/servidor.js`). Los scripts de NPM (`npm run dev`) están prohibidos para despliegues de producción.
