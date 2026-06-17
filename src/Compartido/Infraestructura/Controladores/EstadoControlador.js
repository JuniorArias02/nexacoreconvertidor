import os from 'os';
import fs from 'fs';
import path from 'path';

/**
 * Controlador para mostrar el estado REAL del servidor leyendo las métricas de sistema y logs.
 */
export class EstadoControlador {
    static obtenerEstado(req, res) {
        // 1. Obtener métricas del servidor
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // MB
        const horasActivo = Math.floor(uptime / 3600);
        const minutosActivo = Math.floor((uptime % 3600) / 60);

        // 2. Obtener métricas reales leyendo los logs
        let totalPeticiones = 0;
        let totalExitos = 0;
        let totalErrores = 0;

        const rutaLogs = path.join(process.cwd(), 'storage', 'logs', 'conversiones.log');
        
        if (fs.existsSync(rutaLogs)) {
            const contenidoLogs = fs.readFileSync(rutaLogs, 'utf-8');
            const lineas = contenidoLogs.split('\n');
            
            lineas.forEach(linea => {
                if (linea.includes('[INFO]')) totalPeticiones++;
                if (linea.includes('[EXITO]')) totalExitos++;
                if (linea.includes('[ERROR]')) totalErrores++;
            });
        }

        // Calcular la tasa de éxito (evitar división por cero)
        const tasaExito = totalPeticiones > 0 ? Math.round((totalExitos / totalPeticiones) * 100) : 100;
        const colorTasa = tasaExito > 90 ? '#10b981' : (tasaExito > 70 ? '#f59e0b' : '#ef4444');

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Telemetría | NexaCoreConvertidor</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: #0f172a;
                    color: #f8fafc;
                    font-family: 'Outfit', sans-serif;
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                }
                .hero {
                    position: relative;
                    overflow: hidden;
                    border-radius: 2.5rem;
                    background: linear-gradient(to bottom right, #7c3aed, #4f46e5, #1d4ed8);
                    padding: 3rem 4rem;
                    box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.4);
                    margin-bottom: 2.5rem;
                    width: 100%;
                    max-width: 900px;
                    box-sizing: border-box;
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 9999px;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.25rem 0.75rem;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #fff;
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(12px);
                    margin-bottom: 1.5rem;
                }
                .title {
                    font-size: 3rem;
                    font-weight: 900;
                    letter-spacing: -0.025em;
                    color: #fff;
                    margin: 0 0 1rem 0;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .subtitle {
                    color: #e0e7ff;
                    font-size: 1.125rem;
                    font-weight: 500;
                    line-height: 1.625;
                    opacity: 0.9;
                    margin: 0;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 900px;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(28px) saturate(180%);
                    -webkit-backdrop-filter: blur(28px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 20px 60px -10px rgba(79, 70, 229, 0.15);
                    border-radius: 1.5rem;
                    padding: 2rem;
                    transition: all 0.5s ease;
                    cursor: default;
                }
                .glass-card:hover {
                    transform: scale(1.03);
                    border-color: rgba(99, 102, 241, 0.3);
                    box-shadow: 0 4px 24px -4px rgba(99, 102, 241, 0.25);
                }
                .card-label {
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #94a3b8;
                    margin-bottom: 0.75rem;
                    display: block;
                }
                .card-value {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #f8fafc;
                    margin: 0;
                    letter-spacing: -0.025em;
                }
                .text-success { color: #34d399; }
                .text-warning { color: #fbbf24; }
                .text-danger { color: #f87171; }
                .text-accent { color: #818cf8; }
                .status-dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
                .dot-green { background-color: #34d399; box-shadow: 0 0 12px #34d399; animation: pulse 2s infinite;}
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
                    70% { box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
                }
                .footer {
                    margin-top: 3rem;
                    text-align: center;
                    color: #64748b;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                }
            </style>
        </head>
        <body>
            <div class="hero group">
                <h1 class="title">NexaCoreConvertidor</h1>
                <p class="subtitle">Métricas en tiempo real extraídas del log del sistema y consumo en memoria del servidor.</p>
            </div>

            <div class="grid">
                <div class="glass-card">
                    <span class="card-label">Peticiones Totales</span>
                    <p class="card-value text-accent">${totalPeticiones}</p>
                </div>
                <div class="glass-card">
                    <span class="card-label">Conversiones Exitosas</span>
                    <p class="card-value text-success">${totalExitos}</p>
                </div>
                <div class="glass-card">
                    <span class="card-label">Tasa de Éxito</span>
                    <p class="card-value" style="color: ${colorTasa};">${tasaExito}%</p>
                </div>
                <div class="glass-card">
                    <span class="card-label">Errores de Conversión</span>
                    <p class="card-value text-danger">${totalErrores}</p>
                </div>
                <div class="glass-card">
                    <span class="card-label">Consumo de Memoria (RSS)</span>
                    <p class="card-value">${memoryUsage.toFixed(1)} <span style="font-size: 1.25rem;">MB</span></p>
                </div>
                <div class="glass-card">
                    <span class="card-label">Uptime del Motor</span>
                    <p class="card-value">${horasActivo}h ${minutosActivo}m</p>
                </div>
            </div>

            <div class="footer">
                NexaCoreConvertidor &nbsp;|&nbsp;  ${os.type()}
            </div>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
}
