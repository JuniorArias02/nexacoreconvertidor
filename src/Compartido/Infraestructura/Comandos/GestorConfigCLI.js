import fs from 'fs';
import path from 'path';

/**
 * REPOSITORIO DE INFRAESTRUCTURA
 * Maneja la lectura y escritura general de configuraciones en el .env
 */
class EnvConfigRepositorio {
    constructor() {
        this.envPath = path.join(process.cwd(), '.env');
    }

    obtener(clave) {
        if (!fs.existsSync(this.envPath)) return null;
        const lines = fs.readFileSync(this.envPath, 'utf-8').split('\n');
        for (const line of lines) {
            if (line.trim().startsWith(`${clave}=`)) {
                return line.split('=')[1].trim();
            }
        }
        return null;
    }

    guardar(clave, valor) {
        if (!fs.existsSync(this.envPath)) {
            fs.writeFileSync(this.envPath, `${clave}=${valor}\n`);
            return;
        }
        let content = fs.readFileSync(this.envPath, 'utf-8');
        if (content.includes(`${clave}=`)) {
            const regex = new RegExp(`^${clave}=.*`, 'm');
            content = content.replace(regex, `${clave}=${valor}`);
        } else {
            const separator = (content.endsWith('\n') || content === '') ? '' : '\n';
            content += `${separator}${clave}=${valor}\n`;
        }
        fs.writeFileSync(this.envPath, content);
    }
    
    eliminarClave(clave) {
        if (!fs.existsSync(this.envPath)) return;
        let content = fs.readFileSync(this.envPath, 'utf-8');
        const regex = new RegExp(`^${clave}=.*\n?`, 'm');
        content = content.replace(regex, '');
        fs.writeFileSync(this.envPath, content.trim() + '\n');
    }
}

/**
 * SERVICIO DE APLICACIÓN
 * Lógica para modificar el Puerto y los CORS
 */
class GestorConfigAppService {
    constructor(repo) {
        this.repo = repo;
    }

    setPort(puerto) {
        if (!puerto || isNaN(puerto)) {
            console.error('\n❌ ERROR: Debes proporcionar un número de puerto válido.');
            console.error('💡 Uso: npm run config:port 8192\n');
            return;
        }
        
        this.repo.guardar('PORT', puerto);
        this.repo.eliminarClave('PUERTO'); // Eliminar PUERTO obsoleto si existe
        
        console.log('\n==================================');
        console.log(`✅ PUERTO ACTUALIZADO A: ${puerto}`);
        console.log('==================================');
        console.log('⚠️ ALERTA: Debes reiniciar el servidor para aplicar el cambio.\n');
    }

    listCors() {
        const corsStr = this.repo.obtener('CORS_ORIGENES_PERMITIDOS') || '';
        const origenes = corsStr.split(',').filter(Boolean);
        
        console.log('\n==================================');
        console.log('      CORS | ORÍGENES PERMITIDOS  ');
        console.log('==================================');
        
        if (origenes.length === 0) {
            console.log('⚠️ No hay orígenes configurados en el .env');
        } else {
            origenes.forEach((o, i) => console.log(`[${i + 1}] ${o}`));
        }
        console.log('==================================\n');
    }

    addCors(origen) {
        if (!origen) {
            console.error('\n❌ ERROR: Debes proporcionar la URL del origen.');
            console.error('💡 Uso: npm run cors:add "http://192.168.1.50"\n');
            return;
        }
        
        const corsStr = this.repo.obtener('CORS_ORIGENES_PERMITIDOS') || '';
        const origenes = corsStr.split(',').filter(Boolean);
        
        if (origenes.includes(origen)) {
            console.log(`\n⚠️ El origen "${origen}" ya está autorizado.\n`);
            return;
        }
        
        origenes.push(origen);
        this.repo.guardar('CORS_ORIGENES_PERMITIDOS', origenes.join(','));
        
        console.log(`\n✅ NUEVO ORIGEN AÑADIDO: ${origen}`);
        console.log('⚠️ ALERTA: Reinicia el servidor para actualizar la seguridad.\n');
    }

    removeCors(origen) {
        if (!origen) {
            console.error('\n❌ ERROR: Debes proporcionar la URL del origen a eliminar.');
            console.error('💡 Uso: npm run cors:remove "http://192.168.1.50"\n');
            return;
        }
        
        const corsStr = this.repo.obtener('CORS_ORIGENES_PERMITIDOS') || '';
        const origenes = corsStr.split(',').filter(Boolean);
        const filtrados = origenes.filter(o => o !== origen);
        
        if (origenes.length === filtrados.length) {
            console.log(`\n⚠️ ADVERTENCIA: El origen "${origen}" no existe en la lista de CORS.\n`);
            return;
        }
        
        this.repo.guardar('CORS_ORIGENES_PERMITIDOS', filtrados.join(','));
        
        console.log(`\n🗑️ ORIGEN ELIMINADO CON ÉXITO: ${origen}`);
        console.log('⚠️ ALERTA: Reinicia el servidor para aplicar el bloqueo.\n');
    }
}

/**
 * CONTROLADOR CLI (Adaptador)
 */
const repo = new EnvConfigRepositorio();
const app = new GestorConfigAppService(repo);

const entidad = process.argv[2]; // 'port' o 'cors'
const accion = process.argv[3]; // 'set', 'list', 'add', 'remove'
const parametro = process.argv[4];

if (entidad === 'port' && accion === 'set') {
    app.setPort(parametro);
} else if (entidad === 'cors') {
    if (accion === 'list') app.listCors();
    else if (accion === 'add') app.addCors(parametro);
    else if (accion === 'remove') app.removeCors(parametro);
    else console.log('\n❌ Comando CORS no válido.\n');
} else {
    console.log('\n❌ Comando no reconocido.\n');
}
