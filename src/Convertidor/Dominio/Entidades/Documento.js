/**
 * Entidad de Dominio: Documento
 * Representa un documento dentro de nuestro dominio, validando que tenga
 * los atributos esenciales requeridos para cualquier operación.
 */
export class Documento {
    constructor({ nombreOriginal, buffer, mimetype, tamanio }) {
        this.nombreOriginal = nombreOriginal;
        this.buffer = buffer;
        this.mimetype = mimetype;
        this.tamanio = tamanio;

        this.validar();
    }

    validar() {
        if (!this.buffer || this.buffer.length === 0) {
            throw new Error('El documento no puede estar vacío (buffer nulo).');
        }

        if (!this.nombreOriginal) {
            throw new Error('El documento debe tener un nombre original.');
        }

        // Validación simple de extensiones (se puede extender o ser más estricta según el negocio)
        if (!this.nombreOriginal.endsWith('.xlsx') && !this.nombreOriginal.endsWith('.xls')) {
            throw new Error('El archivo proporcionado no es un formato de Excel válido (.xlsx o .xls).');
        }
    }

    obtenerNombreSinExtension() {
        const partes = this.nombreOriginal.split('.');
        partes.pop();
        return partes.join('.');
    }
}
