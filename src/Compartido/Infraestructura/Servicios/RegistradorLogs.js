import fs from 'fs';
import path from 'path';

/**
 * Servicio de Infraestructura: Registrador de Logs
 * Se encarga de escribir los eventos del sistema en un archivo de texto plano.
 */
export class RegistradorLogs {
    /**
     * Escribe un mensaje en el archivo de logs estándar.
     * @param {string} nivel - INFO, EXITO, ERROR, WARNING
     * @param {string} mensaje - El texto a registrar
     */
    static registrar(nivel, mensaje) {
        // Apunta a /storage/logs/conversiones.log en la raíz del proyecto
        const directorioLogs = path.join(process.cwd(), 'storage', 'logs');
        const rutaArchivo = path.join(directorioLogs, 'conversiones.log');

        try {
            // Crea la carpeta si no existe (de forma síncrona para asegurar que esté lista)
            if (!fs.existsSync(directorioLogs)) {
                fs.mkdirSync(directorioLogs, { recursive: true });
            }

            // Obtener fecha en formato local o ISO
            const fechaHora = new Date().toISOString();
            
            // Estructura: [FECHA] [NIVEL] Mensaje
            const lineaLog = `[${fechaHora}] [${nivel.toUpperCase()}] ${mensaje}\n`;

            // Escribir en el archivo de manera asíncrona para no bloquear el Event Loop
            fs.appendFile(rutaArchivo, lineaLog, (err) => {
                if (err) {
                    console.error('Error crítico: No se pudo escribir en el log de conversiones.', err);
                }
            });
        } catch (error) {
            console.error('Error al inicializar el directorio de logs:', error);
        }
    }
}
