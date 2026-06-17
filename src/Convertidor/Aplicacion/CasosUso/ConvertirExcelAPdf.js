import { Documento } from '../../Dominio/Entidades/Documento.js';

/**
 * Caso de Uso: Convertir Excel a PDF
 * Orquesta la lógica para transformar un archivo Excel en PDF
 * delegando la tarea real de conversión al puerto de infraestructura.
 */
export class ConvertirExcelAPdf {
    /**
     * @param {Object} servicioConvertidor - Implementación de la interfaz de conversión (Infraestructura)
     */
    constructor(servicioConvertidor) {
        this.servicioConvertidor = servicioConvertidor;
    }

    /**
     * Ejecuta el caso de uso.
     * @param {Object} datosArchivo - Datos puros recibidos del controlador
     * @returns {Promise<Buffer>} - Buffer del PDF resultante
     */
    async ejecutar(datosArchivo) {
        // 1. Instanciar y validar la entidad de dominio
        const documento = new Documento({
            nombreOriginal: datosArchivo.originalname,
            buffer: datosArchivo.buffer,
            mimetype: datosArchivo.mimetype,
            tamanio: datosArchivo.size
        });

        const pdfBuffer = await this.servicioConvertidor.convertir(documento.buffer, '.pdf');

        return pdfBuffer;
    }
}
