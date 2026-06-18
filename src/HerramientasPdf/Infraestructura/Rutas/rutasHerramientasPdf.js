import express from 'express';
import multer from 'multer';
import { ManipuladorPdfServicio } from '../Servicios/ManipuladorPdfServicio.js';
import { UnirPdfsUseCase } from '../../Aplicacion/UnirPdfsUseCase.js';
import { SepararPdfUseCase } from '../../Aplicacion/SepararPdfUseCase.js';
import { ControladorHerramientasPdf } from '../Controladores/ControladorHerramientasPdf.js';

const enrutador = express.Router();
// Multer configurado para procesar archivos en memoria
const subida = multer({ storage: multer.memoryStorage() });

// Inyección de Dependencias
const manipuladorPdfServicio = new ManipuladorPdfServicio();
const unirPdfsUseCase = new UnirPdfsUseCase(manipuladorPdfServicio);
const separarPdfUseCase = new SepararPdfUseCase(manipuladorPdfServicio);
const controladorHerramientasPdf = new ControladorHerramientasPdf(unirPdfsUseCase, separarPdfUseCase);

/**
 * @swagger
 * tags:
 *   name: Herramientas PDF
 *   description: Endpoints para manipulación avanzada de archivos PDF (Unir, Separar)
 */

/**
 * @swagger
 * /api/herramientas-pdf/unir:
 *   post:
 *     summary: Une múltiples archivos PDF en uno solo.
 *     tags: [Herramientas PDF]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos PDF a unir (mínimo 2).
 *     responses:
 *       200:
 *         description: Archivo PDF unido correctamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error de validación o procesamiento.
 *       500:
 *         description: Error interno del servidor.
 */
enrutador.post('/unir', subida.array('archivos', 50), controladorHerramientasPdf.unirPdfs);

/**
 * @swagger
 * /api/herramientas-pdf/separar:
 *   post:
 *     summary: Separa un rango de páginas de un PDF.
 *     tags: [Herramientas PDF]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - archivo
 *               - paginaInicio
 *               - paginaFin
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: El archivo PDF original.
 *               paginaInicio:
 *                 type: integer
 *                 description: Página donde inicia la separación (1-based).
 *               paginaFin:
 *                 type: integer
 *                 description: Página donde termina la separación (1-based).
 *     responses:
 *       200:
 *         description: Archivo PDF separado correctamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error de validación o procesamiento.
 *       500:
 *         description: Error interno del servidor.
 */
enrutador.post('/separar', subida.single('archivo'), controladorHerramientasPdf.separarPdf);

export default enrutador;
