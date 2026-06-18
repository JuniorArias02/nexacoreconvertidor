import { Documento } from '../../Dominio/Entidades/Documento.js';

/**
 * Caso de Uso: Convertir PDF a Word (Docs)
 * Orquesta la lógica para intentar transformar un archivo PDF en Word (.docx)
 * delegando la tarea real de conversión al puerto de infraestructura.
 */
export class ConvertirPdfADocs {
    /**
     * @param {Object} servicioConvertidor - Implementación de la interfaz de conversión (Infraestructura)
     */
    constructor(servicioConvertidor) {
        this.servicioConvertidor = servicioConvertidor;
    }

    /**
     * Ejecuta el caso de uso.
     * @param {Object} datosArchivo - Datos puros recibidos del controlador
     * @returns {Promise<Buffer>} - Buffer del Word resultante
     */
    async ejecutar(datosArchivo) {
        const documento = new Documento({
            nombreOriginal: datosArchivo.originalname,
            buffer: datosArchivo.buffer,
            mimetype: datosArchivo.mimetype,
            tamanio: datosArchivo.size,
            extensionesValidas: ['.pdf']
        });

        const docxBuffer = await this.servicioConvertidor.convertir(documento.buffer, '.docx');

        return docxBuffer;
    }
}
