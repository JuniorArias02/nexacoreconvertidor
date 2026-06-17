import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

/**
 * Objeto centralizado con todas las variables de entorno de la aplicación.
 * Previene el uso de "process.env" disperso por todo el código y provee valores por defecto.
 */
export const entorno = {
    // Puerto donde se levantará el servicio
    puerto: process.env.PORT || 3000,
    
    // Lista de orígenes permitidos para la política CORS
    corsOrigenesPermitidos: process.env.CORS_ORIGENES_PERMITIDOS 
        ? process.env.CORS_ORIGENES_PERMITIDOS.split(',') 
        : ['*'], // Si no se define, permite todo por defecto
        
    // Lista dinámica de API Keys válidas extrayendo todas las variables que empiezan por "API_KEY_"
    apiKeysValidas: Object.keys(process.env).filter(key => key.startsWith('API_KEY_')).length > 0
        ? Object.keys(process.env).filter(key => key.startsWith('API_KEY_')).map(k => process.env[k].trim())
        : ['token-de-desarrollo-local']
};
