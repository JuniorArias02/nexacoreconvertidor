export class UnirPdfsUseCase {
    constructor(manipuladorPdfServicio) {
        this.manipuladorPdfServicio = manipuladorPdfServicio;
    }

    /**
     * Ejecuta el caso de uso para unir múltiples PDFs.
     * @param {Array} archivos Array de objetos archivo provistos por Multer
     * @returns {Promise<Buffer>} Buffer del PDF unido
     */
    async ejecutar(archivos) {
        if (!archivos || archivos.length < 2) {
            throw new Error("Se requieren al menos dos archivos PDF para unir.");
        }

        const buffers = archivos.map(file => file.buffer);
        return await this.manipuladorPdfServicio.unirPdfs(buffers);
    }
}
