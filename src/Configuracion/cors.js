import cors from 'cors';
import { entorno } from './entorno.js';

/**
 * Configuración de CORS para la aplicación.
 * Limita el acceso basándose en las variables de entorno.
 */
const opcionesCors = {
    origin: entorno.corsOrigenesPermitidos,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

export const middlewareCors = cors(opcionesCors);
