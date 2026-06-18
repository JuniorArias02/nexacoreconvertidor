/**
 * Entidad de Dominio: Documento
 * Representa un documento dentro de nuestro dominio, validando que tenga
 * los atributos esenciales requeridos para cualquier operación.
 */
export class Documento {
    constructor({ nombreOriginal, buffer, mimetype, tamanio, extensionesValidas = ['.xlsx', '.xls'] }) {
        this.nombreOriginal = nombreOriginal;
        this.buffer = buffer;
        this.mimetype = mimetype;
        this.tamanio = tamanio;
        this.extensionesValidas = extensionesValidas;

        this.validar();
    }

    validar() {
        if (!this.buffer || this.buffer.length === 0) {
            throw new Error('El documento no puede estar vacío (buffer nulo).');
        }

        if (!this.nombreOriginal) {
            throw new Error('El documento debe tener un nombre original.');
        }

        // Validación simple de extensiones
        const extensionValida = this.extensionesValidas.some(ext => this.nombreOriginal.toLowerCase().endsWith(ext));
        
        if (!extensionValida) {
            throw new Error(`El archivo proporcionado no tiene un formato válido. Formatos aceptados: ${this.extensionesValidas.join(', ')}.`);
        }
    }

    obtenerNombreSinExtension() {
        const partes = this.nombreOriginal.split('.');
        partes.pop();
        return partes.join('.');
    }
}
