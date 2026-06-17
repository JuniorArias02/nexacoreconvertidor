import { ConvertirExcelAPdf } from '../../Aplicacion/CasosUso/ConvertirExcelAPdf.js';
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
}
