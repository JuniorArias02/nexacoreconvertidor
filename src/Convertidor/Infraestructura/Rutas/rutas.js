import { Router } from 'express';
import multer from 'multer';
import { ConvertidorControlador } from '../Controladores/ConvertidorControlador.js';
import { verificarApiKey } from '../../../Compartido/Middlewares/verificarApiKey.js';

const enrutador = Router();

// Configuración de Multer para manejar los archivos en memoria (Buffer)
// No guardamos nada en disco para evitar archivos basura.
const almacenamientoEnMemoria = multer.memoryStorage();
const subida = multer({ 
    storage: almacenamientoEnMemoria,
    // Opcional: Límite de tamaño (ej. 10MB)
    limits: { fileSize: 10 * 1024 * 1024 } 
});

/**
 * @swagger
 * /api/convertir/excel-a-pdf:
 *   post:
 *     summary: Convierte un archivo Excel a PDF
 *     description: Sube un archivo de Excel (.xlsx o .xls) para procesarlo en memoria y devolverlo convertido a formato PDF.
 *     tags: [Convertidor]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 format: binary
 *                 description: El archivo Excel a convertir.
 *     responses:
 *       200:
 *         description: Archivo PDF generado exitosamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Archivo no proporcionado o formato inválido.
 *       500:
 *         description: Error interno del servidor durante la conversión.
 */
// Definición del endpoint
// Usamos .single('documento') indicando que el cliente (ej. Laravel) enviará el archivo 
// en un form-data con el campo "documento".
enrutador.post(
    '/convertir/excel-a-pdf', 
    verificarApiKey, // Protegemos específicamente este endpoint
    subida.single('documento'), 
    ConvertidorControlador.convertirExcelAPdf
);

export default enrutador;
