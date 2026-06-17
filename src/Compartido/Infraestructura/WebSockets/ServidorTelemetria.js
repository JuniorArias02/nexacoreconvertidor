import { Server } from 'socket.io';
import { TelemetriaServicio } from '../Servicios/TelemetriaServicio.js';

/**
 * SERVIDOR DE WEBSOCKETS
 * Levanta una conexión bidireccional sobre el servidor HTTP.
 */
export class ServidorTelemetria {
    static inicializar(servidorHttp) {
        // Inicializamos Socket.IO adjunto al servidor nativo de Node
        const io = new Server(servidorHttp, {
            cors: {
                origin: "*", // En este microservicio interno permitimos visualización amplia
                methods: ["GET", "POST"]
            }
        });

        // Escuchar cuando la SPA (Frontend) se conecta
        io.on('connection', (socket) => {
            console.log(`🔌 [WebSocket] Cliente conectado al Dashboard: ${socket.id}`);

            // Enviar primer pulso inmediato
            socket.emit('telemetria_actualizada', TelemetriaServicio.obtenerMétricas());

            // Iniciar intervalo para empujar (Push) datos al frontend cada 1 segundo (Tiempo real)
            const intervaloTelemetria = setInterval(() => {
                socket.emit('telemetria_actualizada', TelemetriaServicio.obtenerMétricas());
            }, 1000);

            // Limpieza al desconectarse
            socket.on('disconnect', () => {
                console.log(`🔌 [WebSocket] Cliente desconectado: ${socket.id}`);
                clearInterval(intervaloTelemetria);
            });
        });

        console.log('📡 [WebSocket] Motor de Telemetría en Tiempo Real ACTIVADO.');
    }
}
