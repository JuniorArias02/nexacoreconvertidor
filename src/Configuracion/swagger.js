import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { entorno } from './entorno.js';

// Opciones de configuración para Swagger (OpenAPI 3.0)
const opcionesSwagger = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NexaCore Services API',
            version: '1.0.0',
            description: 'Documentación oficial de los microservicios de NexaCore. Aquí encontrarás los endpoints disponibles, como el convertidor de documentos.',
            contact: {
                name: 'Departamento de Sistemas'
            }
        },
        servers: [
            {
                url: `http://localhost:${entorno.puerto}`,
                description: 'Servidor Local de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'Ingresa la API Key para autorizar la petición.'
                }
            }
        },
        security: [{
            ApiKeyAuth: []
        }]
    },
    // Apunta a todos los archivos de rutas dentro de la carpeta Infraestructura de todos los módulos
    apis: ['./src/*/Infraestructura/Rutas/*.js'], 
};

const especificacionSwagger = swaggerJsdoc(opcionesSwagger);

/**
 * Función para montar Swagger UI en la aplicación de Express
 * @param {import('express').Express} aplicacion 
 */
export const configurarDocumentacion = (aplicacion) => {
    // CSS Personalizado para un look "Ultra-Premium" y convertir el link de descarga en botón
    const estiloPersonalizado = `
        .swagger-ui .topbar { display: none !important; }
        .swagger-ui .info .title { color: #1e40af !important; font-weight: 800 !important; font-family: sans-serif; }
        .swagger-ui .btn.execute { background-color: #2563eb !important; border-color: #2563eb !important; color: white !important; font-weight: bold !important; border-radius: 8px !important; box-shadow: 0 4px 6px rgba(37,99,235,0.2) !important; }
        .swagger-ui .btn.execute:hover { background-color: #1d4ed8 !important; transform: translateY(-1px); }
        .swagger-ui .opblock.opblock-post { border-radius: 12px; border-color: rgba(37,99,235,0.3); background: rgba(37,99,235,0.03); }
        .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #2563eb; border-radius: 6px; }
        
        /* Estilizar el enlace "Download file" para que sea un botón verde bonito */
        .swagger-ui .download-contents, .swagger-ui a[download] { 
            background-color: #10b981 !important; 
            color: #ffffff !important; 
            padding: 10px 20px !important; 
            border-radius: 8px !important; 
            text-decoration: none !important; 
            font-weight: 600 !important; 
            display: inline-block !important; 
            margin-top: 10px !important;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3) !important;
            transition: all 0.2s ease-in-out !important;
            font-family: sans-serif;
        }
        .swagger-ui .download-contents:hover, .swagger-ui a[download]:hover {
            background-color: #059669 !important;
            transform: translateY(-2px) !important;
        }
    `;

    // Montar la interfaz interactiva de Swagger en la ruta /api/docs
    aplicacion.use('/api/docs', swaggerUi.serve, swaggerUi.setup(especificacionSwagger, {
        customCss: estiloPersonalizado,
        customSiteTitle: "NexaCore API Docs"
    }));
    
    // Si quieres exponer también el JSON puro
    aplicacion.get('/api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(especificacionSwagger);
    });
};
