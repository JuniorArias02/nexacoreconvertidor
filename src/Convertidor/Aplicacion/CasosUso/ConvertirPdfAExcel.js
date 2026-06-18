import { Documento } from '../../Dominio/Entidades/Documento.js';

/**
 * Caso de Uso: Convertir PDF a Excel
 * Orquesta la lógica para intentar transformar un archivo PDF en Excel (.xlsx)
 * delegando la tarea real de conversión al puerto de infraestructura.
 */
export class ConvertirPdfAExcel {
    /**
     * @param {Object} servicioConvertidor - Implementación de la interfaz de conversión (Infraestructura)
     */
    constructor(servicioConvertidor) {
        this.servicioConvertidor = servicioConvertidor;
    }

    /**
     * Ejecuta el caso de uso.
     * @param {Object} datosArchivo - Datos puros recibidos del controlador
     * @returns {Promise<Buffer>} - Buffer del Excel resultante
     */
    async ejecutar(datosArchivo) {
        // 1. Instanciar y validar la entidad de dominio
        const documento = new Documento({
            nombreOriginal: datosArchivo.originalname,
            buffer: datosArchivo.buffer,
            mimetype: datosArchivo.mimetype,
            tamanio: datosArchivo.size,
            extensionesValidas: ['.pdf']
        });

        // 2. Ejecutar la conversión a Excel
        const excelBuffer = await this.servicioConvertidor.convertir(documento.buffer, '.xlsx');

        return excelBuffer;
    }
}
