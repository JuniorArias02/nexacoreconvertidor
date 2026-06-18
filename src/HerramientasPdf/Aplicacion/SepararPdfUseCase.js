export class SepararPdfUseCase {
    constructor(manipuladorPdfServicio) {
        this.manipuladorPdfServicio = manipuladorPdfServicio;
    }

    /**
     * Ejecuta el caso de uso para separar páginas de un PDF.
     * @param {Object} archivo Objeto archivo provisto por Multer
     * @param {string|number} paginaInicio Página inicial
     * @param {string|number} paginaFin Página final
     * @returns {Promise<Buffer>} Buffer del PDF separado
     */
    async ejecutar(archivo, paginaInicio, paginaFin) {
        if (!archivo) {
            throw new Error("Se requiere el archivo PDF original para separar.");
        }
        
        const inicio = parseInt(paginaInicio, 10);
        const fin = parseInt(paginaFin, 10);

        if (isNaN(inicio) || isNaN(fin)) {
            throw new Error("Las páginas de inicio y fin deben ser números válidos.");
        }

        return await this.manipuladorPdfServicio.separarPdf(archivo.buffer, inicio, fin);
    }
}
