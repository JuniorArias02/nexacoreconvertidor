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
    // Montar la interfaz interactiva de Swagger en la ruta /api/docs
    aplicacion.use('/api/docs', swaggerUi.serve, swaggerUi.setup(especificacionSwagger, {
        customCss: '.swagger-ui .topbar { display: none }', // Para ocultar la barra verde superior de Swagger si deseas un look más limpio
        customSiteTitle: "NexaCore API Docs"
    }));
    
    // Si quieres exponer también el JSON puro
    aplicacion.get('/api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(especificacionSwagger);
    });
};
