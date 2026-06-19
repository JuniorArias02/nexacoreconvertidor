import libre from 'libreoffice-convert';
import os from 'os';
import fs from 'fs';

/**
 * ========================================================
 * SISTEMA DE COLA (QUEUE) PARA LIBREOFFICE
 * ========================================================
 * LibreOffice es muy pesado. Si llegan 100 peticiones a la vez, 
 * Node intentará abrir 100 procesos "soffice.bin" colapsando el servidor 
 * (Out of Memory o 100% CPU).
 * Este sistema limita la concurrencia protegiendo el host (Windows Server).
 */

// Si tiene 4 núcleos, usa 3 para conversión y deja 1 para Node y el OS.
const limiteConcurrencia = Math.max(1, os.cpus().length - 1); 
let tareasActivas = 0;
const colaDeEspera = [];

const encolarConversion = (tarea) => {
    return new Promise((resolve, reject) => {
        colaDeEspera.push(async () => {
            try {
                const resultado = await tarea();
                resolve(resultado);
            } catch (error) {
                reject(error);
            } finally {
                tareasActivas--;
                procesarSiguiente();
            }
        });
        
        // Si no hemos llegado al límite, arrancamos la tarea recién encolada
        procesarSiguiente();
    });
};

const procesarSiguiente = () => {
    if (tareasActivas < limiteConcurrencia && colaDeEspera.length > 0) {
        tareasActivas++;
        const siguienteTarea = colaDeEspera.shift();
        siguienteTarea();
    }
};

// Wrapper manual de la librería base
const convertirAsync = (buffer, formato, filtro) => {
    return new Promise((resolve, reject) => {
        let options = {
            execOptions: {
                timeout: 120000, // 2 Minutos máximo para que LibreOffice responda
                killSignal: 'SIGKILL' // Si LibreOffice se cuelga, lo matamos de raíz
            }
        };
        const tempDirCustom = process.env.LIBREOFFICE_TEMP_DIR;

        // Si se configuró un directorio temporal para LibreOffice en el .env, lo utilizamos.
        if (tempDirCustom) {
            if (!fs.existsSync(tempDirCustom)) {
                fs.mkdirSync(tempDirCustom, { recursive: true });
            }
            options.tmpOptions = {
                dir: tempDirCustom
            };
            options.execOptions.env = {
                ...process.env,
                TEMP: tempDirCustom,
                TMP: tempDirCustom,
                TMPDIR: tempDirCustom
            };
        }

        libre.convertWithOptions(buffer, formato, filtro, options, (error, documentoConvertido) => {
            if (error) {
                return reject(error);
            }
            resolve(documentoConvertido);
        });
    });
};

/**
 * Servicio de Infraestructura: Convertidor LibreOffice
 * Adaptador que implementa el motor real de conversión local, protegido por Cola.
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
            const extension = formatoDestino.replace('.', '');
            
            // Aquí entra la magia: en lugar de ejecutar crudo, lo pasamos por la cola
            const pdfBuffer = await encolarConversion(() => convertirAsync(documentoBuffer, extension, undefined));
            
            return pdfBuffer;
        } catch (error) {
            console.error('Error interno en ConvertidorLibreOffice:', error);
            throw new Error(`Fallo al convertir el documento usando LibreOffice: ${error.message}`);
        }
    }
}
