import http from 'http';
import aplicacion from './Configuracion/app.js';
import { entorno } from './Configuracion/entorno.js';
import { ServidorTelemetria } from './Compartido/Infraestructura/WebSockets/ServidorTelemetria.js';

// 1. Crear el servidor HTTP nativo inyectando Express
const servidor = http.createServer(aplicacion);

// 2. Montar Socket.io sobre el servidor HTTP
ServidorTelemetria.inicializar(servidor);

// 3. Levantar el servidor híbrido (REST + WebSockets)
servidor.listen(entorno.puerto, () => {
    console.log(`🚀 Microservicio ejecutándose en http://localhost:${entorno.puerto}`);
    console.log(`Endpoints disponibles:`);
    console.log(` - POST /api/convertir/excel-a-pdf`);
    console.log(` - GET  /api/state  (Dashboard en Tiempo Real)`);
    console.log(` - GET  /api/docs   (Swagger)`);
});
