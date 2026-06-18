import { PDFDocument } from 'pdf-lib';
import { ErrorProcesamientoPdf } from '../../Dominio/Errores.js';

export class ManipuladorPdfServicio {
    /**
     * Une varios archivos PDF en uno solo.
     * @param {Buffer[]} buffersPdf Array de buffers de los PDFs a unir.
     * @returns {Promise<Buffer>} Buffer del PDF resultante.
     */
    async unirPdfs(buffersPdf) {
        try {
            const pdfFusionado = await PDFDocument.create();

            for (const buffer of buffersPdf) {
                const pdf = await PDFDocument.load(buffer);
                const indicesPaginas = pdf.getPageIndices();
                const paginas = await pdfFusionado.copyPages(pdf, indicesPaginas);
                paginas.forEach((pagina) => pdfFusionado.addPage(pagina));
            }

            const pdfBytes = await pdfFusionado.save();
            return Buffer.from(pdfBytes);
        } catch (error) {
            throw new ErrorProcesamientoPdf(`Error al unir los PDFs: ${error.message}`);
        }
    }

    /**
     * Extrae un rango de páginas de un PDF.
     * @param {Buffer} bufferPdf Buffer del PDF original.
     * @param {number} paginaInicio Índice de inicio (1-based).
     * @param {number} paginaFin Índice de fin (1-based).
     * @returns {Promise<Buffer>} Buffer del PDF resultante.
     */
    async separarPdf(bufferPdf, paginaInicio, paginaFin) {
        try {
            const pdfOriginal = await PDFDocument.load(bufferPdf);
            const totalPaginas = pdfOriginal.getPageCount();

            if (paginaInicio < 1 || paginaFin > totalPaginas || paginaInicio > paginaFin) {
                throw new ErrorProcesamientoPdf(`Rango de páginas inválido. El documento tiene ${totalPaginas} páginas.`);
            }

            const pdfNuevo = await PDFDocument.create();
            // Los índices en pdf-lib son 0-based
            const indicesACopiar = [];
            for (let i = paginaInicio - 1; i <= paginaFin - 1; i++) {
                indicesACopiar.push(i);
            }

            const paginas = await pdfNuevo.copyPages(pdfOriginal, indicesACopiar);
            paginas.forEach((pagina) => pdfNuevo.addPage(pagina));

            const pdfBytes = await pdfNuevo.save();
            return Buffer.from(pdfBytes);
        } catch (error) {
            if (error instanceof ErrorProcesamientoPdf) throw error;
            throw new ErrorProcesamientoPdf(`Error al separar el PDF: ${error.message}`);
        }
    }
}
