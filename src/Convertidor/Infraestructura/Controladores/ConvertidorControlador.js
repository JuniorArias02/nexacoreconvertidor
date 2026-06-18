import { ConvertirExcelAPdf } from '../../Aplicacion/CasosUso/ConvertirExcelAPdf.js';
import { ConvertirDocsAPdf } from '../../Aplicacion/CasosUso/ConvertirDocsAPdf.js';
import { ConvertirImagenAPdf } from '../../Aplicacion/CasosUso/ConvertirImagenAPdf.js';
import { ConvertirPdfAExcel } from '../../Aplicacion/CasosUso/ConvertirPdfAExcel.js';
import { ConvertirPdfADocs } from '../../Aplicacion/CasosUso/ConvertirPdfADocs.js';
import { ConvertidorLibreOffice } from '../Servicios/ConvertidorLibreOffice.js';
import { RegistradorLogs } from '../../../Compartido/Infraestructura/Servicios/RegistradorLogs.js';

/**
 * Controlador HTTP para la conversión de documentos.
 * Maneja las peticiones de Express, interactúa con el Caso de Uso y responde al cliente.
 */
export class ConvertidorControlador {
    /**
     * Maneja el endpoint de conversión de Excel a PDF.
     */
    static async convertirExcelAPdf(req, res) {
        // Extraemos la IP o el cliente para fines de auditoría
        const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        try {
            // 1. Validar si el archivo vino en la petición
            if (!req.file) {
                RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Intento de conversión sin archivo adjunto.`);
                return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
            }

            const nombreArchivo = req.file.originalname;
            const tamanoKB = (req.file.size / 1024).toFixed(2);
            
            RegistradorLogs.registrar('INFO', `IP: ${ipCliente} | Iniciando conversión de "${nombreArchivo}" (${tamanoKB} KB)`);

            // 2. Instanciar las dependencias. 
            const servicioConvertidor = new ConvertidorLibreOffice();
            const casoUso = new ConvertirExcelAPdf(servicioConvertidor);

            // 3. Ejecutar el caso de uso
            const pdfBuffer = await casoUso.ejecutar(req.file);

            // 4. Preparar la respuesta HTTP
            res.setHeader('Content-Type', 'application/pdf');
            const nombreBase = nombreArchivo.split('.').slice(0, -1).join('.') || 'documento';
            res.setHeader('Content-Disposition', `attachment; filename="${nombreBase}.pdf"`);

            RegistradorLogs.registrar('EXITO', `IP: ${ipCliente} | Conversión exitosa de "${nombreArchivo}" a PDF.`);

            // 5. Retornar el buffer (flujo de datos)
            return res.send(pdfBuffer);

        } catch (error) {
            const nombreArchivoError = req.file ? req.file.originalname : 'Desconocido';
            RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Archivo: "${nombreArchivoError}" | Falló la conversión: ${error.message}`);
            
            console.error('Error en ConvertidorControlador:', error.message);
            // Si el error viene de nuestras validaciones de Dominio, suele ser un 400 Bad Request.
            if (error.message.includes('válido') || error.message.includes('vacío')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor durante la conversión.' });
        }
    }

    /**
     * Maneja el endpoint de conversión de Word (Docs) a PDF.
     */
    static async convertirDocsAPdf(req, res) {
        const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        try {
            if (!req.file) {
                RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Intento de conversión (Docs) sin archivo adjunto.`);
                return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
            }

            const nombreArchivo = req.file.originalname;
            const tamanoKB = (req.file.size / 1024).toFixed(2);
            
            RegistradorLogs.registrar('INFO', `IP: ${ipCliente} | Iniciando conversión de documento Word "${nombreArchivo}" (${tamanoKB} KB)`);

            const servicioConvertidor = new ConvertidorLibreOffice();
            const casoUso = new ConvertirDocsAPdf(servicioConvertidor);

            const pdfBuffer = await casoUso.ejecutar(req.file);

            res.setHeader('Content-Type', 'application/pdf');
            const nombreBase = nombreArchivo.split('.').slice(0, -1).join('.') || 'documento';
            res.setHeader('Content-Disposition', `attachment; filename="${nombreBase}.pdf"`);

            RegistradorLogs.registrar('EXITO', `IP: ${ipCliente} | Conversión exitosa de "${nombreArchivo}" a PDF.`);

            return res.send(pdfBuffer);

        } catch (error) {
            const nombreArchivoError = req.file ? req.file.originalname : 'Desconocido';
            RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Archivo: "${nombreArchivoError}" | Falló la conversión de Word a PDF: ${error.message}`);
            
            console.error('Error en ConvertidorControlador (Docs a PDF):', error.message);
            if (error.message.includes('válido') || error.message.includes('vacío')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor durante la conversión.' });
        }
    }

    /**
     * Maneja el endpoint de conversión de Imagen (PNG/JPG) a PDF.
     */
    static async convertirImagenAPdf(req, res) {
        const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        try {
            if (!req.file) {
                RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Intento de conversión (Imagen) sin archivo adjunto.`);
                return res.status(400).json({ error: 'No se proporcionó ningún archivo de imagen.' });
            }

            const nombreArchivo = req.file.originalname;
            const tamanoKB = (req.file.size / 1024).toFixed(2);
            
            RegistradorLogs.registrar('INFO', `IP: ${ipCliente} | Iniciando conversión de imagen "${nombreArchivo}" (${tamanoKB} KB)`);

            const servicioConvertidor = new ConvertidorLibreOffice();
            const casoUso = new ConvertirImagenAPdf(servicioConvertidor);

            const pdfBuffer = await casoUso.ejecutar(req.file);

            res.setHeader('Content-Type', 'application/pdf');
            const nombreBase = nombreArchivo.split('.').slice(0, -1).join('.') || 'imagen';
            res.setHeader('Content-Disposition', `attachment; filename="${nombreBase}.pdf"`);

            RegistradorLogs.registrar('EXITO', `IP: ${ipCliente} | Conversión exitosa de imagen "${nombreArchivo}" a PDF.`);

            return res.send(pdfBuffer);

        } catch (error) {
            const nombreArchivoError = req.file ? req.file.originalname : 'Desconocido';
            RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Archivo: "${nombreArchivoError}" | Falló la conversión de Imagen a PDF: ${error.message}`);
            
            console.error('Error en ConvertidorControlador (Imagen a PDF):', error.message);
            if (error.message.includes('válido') || error.message.includes('vacío')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor durante la conversión de imagen.' });
        }
    }

    /**
     * Maneja el endpoint de conversión de PDF a Excel (.xlsx).
     */
    static async convertirPdfAExcel(req, res) {
        const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        try {
            if (!req.file) {
                RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Intento de conversión (PDF a Excel) sin archivo adjunto.`);
                return res.status(400).json({ error: 'No se proporcionó ningún archivo PDF.' });
            }

            const nombreArchivo = req.file.originalname;
            const tamanoKB = (req.file.size / 1024).toFixed(2);
            
            RegistradorLogs.registrar('INFO', `IP: ${ipCliente} | Iniciando conversión de PDF a Excel "${nombreArchivo}" (${tamanoKB} KB)`);

            const servicioConvertidor = new ConvertidorLibreOffice();
            const casoUso = new ConvertirPdfAExcel(servicioConvertidor);

            const excelBuffer = await casoUso.ejecutar(req.file);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const nombreBase = nombreArchivo.split('.').slice(0, -1).join('.') || 'documento';
            res.setHeader('Content-Disposition', `attachment; filename="${nombreBase}.xlsx"`);

            RegistradorLogs.registrar('EXITO', `IP: ${ipCliente} | Conversión exitosa de PDF "${nombreArchivo}" a Excel.`);

            return res.send(excelBuffer);

        } catch (error) {
            const nombreArchivoError = req.file ? req.file.originalname : 'Desconocido';
            RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Archivo: "${nombreArchivoError}" | Falló la conversión de PDF a Excel: ${error.message}`);
            
            console.error('Error en ConvertidorControlador (PDF a Excel):', error.message);
            if (error.message.includes('válido') || error.message.includes('vacío')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor durante la conversión de PDF a Excel.' });
        }
    }

    /**
     * Maneja el endpoint de conversión de PDF a Word (.docx).
     */
    static async convertirPdfADocs(req, res) {
        const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        try {
            if (!req.file) {
                RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Intento de conversión (PDF a Word) sin archivo adjunto.`);
                return res.status(400).json({ error: 'No se proporcionó ningún archivo PDF.' });
            }

            const nombreArchivo = req.file.originalname;
            const tamanoKB = (req.file.size / 1024).toFixed(2);
            
            RegistradorLogs.registrar('INFO', `IP: ${ipCliente} | Iniciando conversión de PDF a Word "${nombreArchivo}" (${tamanoKB} KB)`);

            const servicioConvertidor = new ConvertidorLibreOffice();
            const casoUso = new ConvertirPdfADocs(servicioConvertidor);

            const docxBuffer = await casoUso.ejecutar(req.file);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            const nombreBase = nombreArchivo.split('.').slice(0, -1).join('.') || 'documento';
            res.setHeader('Content-Disposition', `attachment; filename="${nombreBase}.docx"`);

            RegistradorLogs.registrar('EXITO', `IP: ${ipCliente} | Conversión exitosa de PDF "${nombreArchivo}" a Word.`);

            return res.send(docxBuffer);

        } catch (error) {
            const nombreArchivoError = req.file ? req.file.originalname : 'Desconocido';
            RegistradorLogs.registrar('ERROR', `IP: ${ipCliente} | Archivo: "${nombreArchivoError}" | Falló la conversión de PDF a Word: ${error.message}`);
            
            console.error('Error en ConvertidorControlador (PDF a Word):', error.message);
            if (error.message.includes('válido') || error.message.includes('vacío')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor durante la conversión de PDF a Word.' });
        }
    }
}
