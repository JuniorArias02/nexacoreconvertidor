import os from 'os';
import fs from 'fs';
import path from 'path';

/**
 * SERVICIO DE INFRAESTRUCTURA
 * Encapsula la lógica de lectura de métricas físicas (RAM, Uptime, Logs)
 * Sirve tanto al Controlador HTTP como al Servidor de WebSockets.
 */
export class TelemetriaServicio {
    static obtenerMétricas() {
        // 1. Obtener métricas de la máquina
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // MB
        const horasActivo = Math.floor(uptime / 3600);
        const minutosActivo = Math.floor((uptime % 3600) / 60);

        // 2. Leer logs físicos generados por las conversiones
        let totalPeticiones = 0;
        let totalExitos = 0;
        let totalErrores = 0;
        let ultimosErrores = [];
        const rutaLogs = path.join(process.cwd(), 'storage', 'logs', 'conversiones.log');
        
        if (fs.existsSync(rutaLogs)) {
            const contenidoLogs = fs.readFileSync(rutaLogs, 'utf-8');
            totalPeticiones = (contenidoLogs.match(/\[INFO\]/g) || []).length;
            totalExitos = (contenidoLogs.match(/\[EXITO\]/g) || []).length;
            
            // Extraer las líneas exactas de error para saber QUÉ falló
            const lineasError = contenidoLogs.split('\n').filter(l => l.includes('[ERROR]'));
            totalErrores = lineasError.length;
            
            // Tomamos los últimos 3 errores, invirtiéndolos para que el más reciente salga de primero
            ultimosErrores = lineasError.slice(-3).reverse().map(l => l.replace(/\[ERROR\] /, ''));
        }

        // 3. Cálculos dinámicos
        const tasaExito = totalPeticiones > 0 ? Math.round((totalExitos / totalPeticiones) * 100) : 100;
        const colorTasa = tasaExito > 90 ? '#34d399' : (tasaExito > 70 ? '#fbbf24' : '#f87171');

        // 4. Salida en formato JSON puro
        return {
            totalPeticiones,
            totalExitos,
            totalErrores,
            tasaExito,
            colorTasa,
            ultimosErrores,
            memoryUsage: memoryUsage.toFixed(1),
            uptimeText: `${horasActivo}h ${minutosActivo}m`,
            osType: os.type()
        };
    }
}
