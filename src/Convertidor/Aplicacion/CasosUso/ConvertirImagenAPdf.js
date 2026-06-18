import { Documento } from '../../Dominio/Entidades/Documento.js';

/**
 * Caso de Uso: Convertir Imagen a PDF
 * Orquesta la lógica para transformar archivos de imagen (PNG, JPG, WEBP) en PDF
 * delegando la tarea real de conversión al puerto de infraestructura.
 */
export class ConvertirImagenAPdf {
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
        const documento = new Documento({
            nombreOriginal: datosArchivo.originalname,
            buffer: datosArchivo.buffer,
            mimetype: datosArchivo.mimetype,
            tamanio: datosArchivo.size,
            extensionesValidas: ['.png', '.jpg', '.jpeg', '.webp']
        });

        const pdfBuffer = await this.servicioConvertidor.convertir(documento.buffer, '.pdf');

        return pdfBuffer;
    }
}
