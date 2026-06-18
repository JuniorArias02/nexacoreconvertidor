export class ErrorProcesamientoPdf extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'ErrorProcesamientoPdf';
    }
}
