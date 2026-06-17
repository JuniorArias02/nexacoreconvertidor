import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { middlewareCors } from './cors.js';

/**
 * Registra todos los middlewares globales en la aplicación de Express.
 * @param {import('express').Express} aplicacion 
 */
export const configurarMiddlewares = (aplicacion) => {
    // 1. Helmet: Protege la app configurando varios encabezados HTTP de seguridad
    // Relajamos ligeramente las políticas de scripts para permitir nuestro HTML desacoplado (telemetría)
    aplicacion.use(helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "script-src": ["'self'", "'unsafe-inline'"],
            },
        },
    }));

    // 2. CORS: Restringe los dominios permitidos
    aplicacion.use(middlewareCors);

    // 3. Rate Limiting: Evita ataques de fuerza bruta o DDoS (ej. max 50 peticiones por minuto)
    const limitador = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minuto
        max: 50, // Límite de 50 peticiones por IP por minuto
        message: { error: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo más tarde.' }
    });
    aplicacion.use('/api', limitador);

    // 4. Parseo del body
    aplicacion.use(express.json({ limit: '5mb' })); // Protege contra payloads JSON gigantes
    aplicacion.use(express.urlencoded({ extended: true, limit: '5mb' }));
};
