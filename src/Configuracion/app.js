import express from 'express';
import { configurarMiddlewares } from './middlewares.js';
import { configurarDocumentacion } from './swagger.js';
import rutasConvertidor from '../Convertidor/Infraestructura/Rutas/rutas.js';
import { EstadoControlador } from '../Compartido/Infraestructura/Controladores/EstadoControlador.js';

// Instanciar la aplicación
const aplicacion = express();

// Configurar middlewares globales
configurarMiddlewares(aplicacion);

// Configurar Swagger (Documentación de la API interactiva)
configurarDocumentacion(aplicacion);

// Registrar Rutas de la API (por Módulos)
// Si agregas más módulos en el futuro, importa sus rutas aquí.
aplicacion.use('/api', rutasConvertidor);

import path from 'path';

// Endpoint visual de estado del servidor (Health Check Frontend)
aplicacion.get('/api/state', EstadoControlador.obtenerVista);

// Endpoint de datos para la telemetría (Health Check Backend JSON)
aplicacion.get('/api/state/data', EstadoControlador.obtenerDatos);

export default aplicacion;
