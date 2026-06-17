import { entorno } from '../../Configuracion/entorno.js';

/**
 * Middleware para proteger rutas específicas verificando que la petición
 * contenga un API Key válido de acuerdo a la configuración del entorno.
 */
export const verificarApiKey = (req, res, next) => {
    const apiKeyCliente = req.headers['x-api-key'];

    if (!apiKeyCliente || !entorno.apiKeysValidas.includes(apiKeyCliente)) {
        return res.status(401).json({ 
            error: 'No autorizado. API Key inválida o no proporcionada en el header x-api-key.' 
        });
    }

    next();
};
