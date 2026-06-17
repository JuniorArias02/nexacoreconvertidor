import fs from 'fs';
import path from 'path';
import { TelemetriaServicio } from '../Servicios/TelemetriaServicio.js';

/**
 * Controlador de Estado (Desacoplado Frontend/Backend)
 * Provee la vista estática y la API de datos.
 */
export class EstadoControlador {
    /**
     * Sirve el archivo HTML (Frontend SPA)
     */
    static obtenerVista(req, res) {
        const vistaPath = path.join(process.cwd(), 'src', 'Compartido', 'Infraestructura', 'Vistas', 'estado.html');
        if (fs.existsSync(vistaPath)) {
            res.sendFile(vistaPath);
        } else {
            res.status(404).send('Error: Archivo de vista no encontrado.');
        }
    }

    /**
     * API Endpoint REST nativo por si alguien no quiere usar WebSockets
     */
    static obtenerDatos(req, res) {
        // La lógica de extracción de datos crudos se delegó al Servicio (Arquitectura Limpia)
        res.json(TelemetriaServicio.obtenerMétricas());
    }
}
