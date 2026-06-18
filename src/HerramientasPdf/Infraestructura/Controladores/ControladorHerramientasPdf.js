import { ErrorProcesamientoPdf } from '../../Dominio/Errores.js';

export class ControladorHerramientasPdf {
    constructor(unirPdfsUseCase, separarPdfUseCase) {
        this.unirPdfsUseCase = unirPdfsUseCase;
        this.separarPdfUseCase = separarPdfUseCase;
    }

    unirPdfs = async (req, res) => {
        try {
            const archivos = req.files; // Array de archivos
            const pdfGenerado = await this.unirPdfsUseCase.ejecutar(archivos);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="pdf_unido.pdf"');
            return res.status(200).send(pdfGenerado);
        } catch (error) {
            const esErrorConocido = error instanceof ErrorProcesamientoPdf || error.message.includes("requieren al menos dos");
            return res.status(esErrorConocido ? 400 : 500).json({
                exito: false,
                mensaje: error.message
            });
        }
    };

    separarPdf = async (req, res) => {
        try {
            const archivo = req.file; // Un solo archivo
            const { paginaInicio, paginaFin } = req.body;

            const pdfGenerado = await this.separarPdfUseCase.ejecutar(archivo, paginaInicio, paginaFin);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="pdf_separado_${paginaInicio}_al_${paginaFin}.pdf"`);
            return res.status(200).send(pdfGenerado);
        } catch (error) {
            const esErrorConocido = error instanceof ErrorProcesamientoPdf || error.message.includes("requiere el archivo");
            return res.status(esErrorConocido ? 400 : 500).json({
                exito: false,
                mensaje: error.message
            });
        }
    };
}
