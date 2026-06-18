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

/**
 * @swagger
 * /api/convertir/docs-a-pdf:
 *   post:
 *     summary: Convierte un archivo Word (Doc/Docx) a PDF
 *     description: Sube un archivo de Word (.doc o .docx) para procesarlo en memoria y devolverlo convertido a formato PDF.
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
 *                 description: El archivo Word a convertir.
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
enrutador.post(
    '/convertir/docs-a-pdf', 
    verificarApiKey, 
    subida.single('documento'), 
    ConvertidorControlador.convertirDocsAPdf
);

/**
 * @swagger
 * /api/convertir/imagen-a-pdf:
 *   post:
 *     summary: Convierte una Imagen (PNG/JPG/WEBP) a PDF
 *     description: Sube un archivo de imagen (.png, .jpg, .jpeg, .webp) para procesarlo en memoria y devolverlo convertido a formato PDF.
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
 *                 description: La imagen a convertir.
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
enrutador.post(
    '/convertir/imagen-a-pdf', 
    verificarApiKey, 
    subida.single('documento'), 
    ConvertidorControlador.convertirImagenAPdf
);

/**
 * @swagger
 * /api/convertir/pdf-a-excel:
 *   post:
 *     summary: Convierte un archivo PDF a Excel
 *     description: Sube un archivo PDF para intentar convertirlo a formato Excel (.xlsx). Nota de advertencia, el motor de LibreOffice puede tener resultados variables dependiendo de la complejidad del PDF.
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
 *                 description: El archivo PDF a convertir.
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Archivo no proporcionado o formato inválido.
 *       500:
 *         description: Error interno del servidor durante la conversión.
 */
enrutador.post(
    '/convertir/pdf-a-excel', 
    verificarApiKey, 
    subida.single('documento'), 
    ConvertidorControlador.convertirPdfAExcel
);

/**
 * @swagger
 * /api/convertir/pdf-a-docs:
 *   post:
 *     summary: Convierte un archivo PDF a Word (Docs)
 *     description: Sube un archivo PDF para intentar convertirlo a formato Word (.docx). Nota de advertencia, LibreOffice extrae el PDF como formas de dibujo, por lo que el formato puede variar.
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
 *                 description: El archivo PDF a convertir.
 *     responses:
 *       200:
 *         description: Archivo Word generado exitosamente.
 *         content:
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Archivo no proporcionado o formato inválido.
 *       500:
 *         description: Error interno del servidor durante la conversión.
 */
enrutador.post(
    '/convertir/pdf-a-docs', 
    verificarApiKey, 
    subida.single('documento'), 
    ConvertidorControlador.convertirPdfADocs
);

export default enrutador;
