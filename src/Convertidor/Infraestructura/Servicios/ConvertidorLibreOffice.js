import libre from 'libreoffice-convert';

// Creamos un wrapper manual en lugar de usar util.promisify para evitar el
// DeprecationWarning de Node, ya que la librería retorna una promesa internamente
// pero a la vez exige un callback obligatoriamente.
const convertirAsync = (buffer, formato, filtro) => {
    return new Promise((resolve, reject) => {
        libre.convert(buffer, formato, filtro, (error, documentoConvertido) => {
            if (error) {
                return reject(error);
            }
            resolve(documentoConvertido);
        });
    });
};

/**
 * Servicio de Infraestructura: Convertidor LibreOffice
 * Adaptador que implementa el motor real de conversión utilizando LibreOffice de forma local.
 */
export class ConvertidorLibreOffice {
    /**
     * Convierte un buffer de documento a un formato específico.
     * @param {Buffer} documentoBuffer - El archivo en memoria a convertir
     * @param {String} formatoDestino - Extensión destino, ej: '.pdf'
     * @returns {Promise<Buffer>} - El buffer convertido
     */
    async convertir(documentoBuffer, formatoDestino) {
        try {
            // El formato sin el punto, ya que libreoffice-convert lo prefiere así en la mayoría de los casos
            const extension = formatoDestino.replace('.', '');
            
            // Ejecutamos la conversión
            const pdfBuffer = await convertirAsync(documentoBuffer, extension, undefined);
            
            return pdfBuffer;
        } catch (error) {
            console.error('Error interno en ConvertidorLibreOffice:', error);
            throw new Error(`Fallo al convertir el documento usando LibreOffice: ${error.message}`);
        }
    }
}
