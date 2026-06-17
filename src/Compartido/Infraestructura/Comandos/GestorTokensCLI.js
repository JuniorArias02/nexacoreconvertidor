import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * REPOSITORIO DE INFRAESTRUCTURA
 * Maneja la lectura/escritura en el archivo .env basándose en el prefijo API_KEY_
 */
class EnvTokenRepositorio {
    constructor() {
        this.envPath = path.join(process.cwd(), '.env');
    }

    obtenerTodos() {
        if (!fs.existsSync(this.envPath)) return {};
        const envContent = fs.readFileSync(this.envPath, 'utf-8');
        const lines = envContent.split('\n');
        
        const tokens = {};
        for (const line of lines) {
            if (line.trim().startsWith('API_KEY_')) {
                const [llave, valor] = line.split('=');
                const nombre = llave.replace('API_KEY_', '');
                if (valor) {
                    tokens[nombre] = valor.trim();
                }
            }
        }
        return tokens;
    }

    guardar(nombre, token) {
        const envContent = fs.existsSync(this.envPath) ? fs.readFileSync(this.envPath, 'utf-8') : '';
        const llave = `API_KEY_${nombre.toUpperCase().replace(/[^A-Z0-9_]/g, '')}`;
        const nuevaLinea = `${llave}=${token}`;
        
        if (envContent.includes(`${llave}=`)) {
            // Reemplazar llave existente
            const regex = new RegExp(`^${llave}=.*`, 'm');
            fs.writeFileSync(this.envPath, envContent.replace(regex, nuevaLinea));
        } else {
            // Agregar nueva llave
            const separator = (envContent.endsWith('\n') || envContent === '') ? '' : '\n';
            fs.writeFileSync(this.envPath, envContent + separator + nuevaLinea + '\n');
        }
    }

    eliminar(nombre) {
        if (!fs.existsSync(this.envPath)) return false;
        const envContent = fs.readFileSync(this.envPath, 'utf-8');
        const llave = `API_KEY_${nombre.toUpperCase().replace(/[^A-Z0-9_]/g, '')}`;
        
        if (envContent.includes(`${llave}=`)) {
            const regex = new RegExp(`^${llave}=.*\n?`, 'm');
            fs.writeFileSync(this.envPath, envContent.replace(regex, ''));
            return true;
        }
        return false;
    }
}

/**
 * SERVICIO DE APLICACIÓN (Use Cases)
 * Orquesta la lógica de negocio para gestionar los tokens como diccionario.
 */
class GestorTokenAppService {
    constructor(repositorio) {
        this.repo = repositorio;
    }

    listar() {
        const tokens = this.repo.obtenerTodos();
        const llaves = Object.keys(tokens);

        console.log('\n==================================');
        console.log('   NEXACORE | DICCIONARIO DE TOKENS ');
        console.log('==================================');
        
        if (llaves.length === 0) {
            console.log('❌ No hay tokens registrados en el sistema.');
        } else {
            llaves.forEach(nombre => {
                console.log(`📌 PROYECTO: ${nombre}`);
                console.log(`🔑 TOKEN:    ${tokens[nombre]}\n`);
            });
        }
        console.log('==================================\n');
    }

    generar(nombre) {
        if (!nombre) {
            console.error('\n❌ ERROR: Faltan argumentos.');
            console.error('💡 Uso: npm run token:generate "NombreProyecto"\n');
            return;
        }
        
        const nombreLimpio = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
        const nuevoToken = `nx_live_${nombreLimpio}_${crypto.randomBytes(24).toString('hex')}`;
        
        this.repo.guardar(nombre, nuevoToken);

        console.log(`\n✅ TOKEN GENERADO Y ASIGNADO A: ${nombre.toUpperCase()}`);
        console.log(`🔑 ${nuevoToken}`);
        console.log('\n⚠️ RECUERDA: Debes reiniciar el servidor para cargar las nuevas credenciales.\n');
    }

    eliminar(nombre) {
        if (!nombre) {
            console.error('\n❌ ERROR: Debes especificar el nombre del proyecto a revocar.');
            console.error('💡 Uso: npm run token:delete "NombreProyecto"\n');
            return;
        }

        const borrado = this.repo.eliminar(nombre);

        if (!borrado) {
            console.log(`\n⚠️ ADVERTENCIA: No se encontró ningún token asociado al proyecto "${nombre.toUpperCase()}".\n`);
            return;
        }
        
        console.log(`\n🗑️ TOKEN DE "${nombre.toUpperCase()}" REVOCADO Y ELIMINADO CORRECTAMENTE.`);
        console.log('⚠️ RECUERDA: Reinicia el servidor para destruir el acceso en memoria.\n');
    }
}

/**
 * CONTROLADOR CLI (Adaptador)
 */
const repo = new EnvTokenRepositorio();
const appService = new GestorTokenAppService(repo);

const accion = process.argv[2];
const parametro = process.argv[3];

switch (accion) {
    case 'list':
        appService.listar();
        break;
    case 'generate':
        appService.generar(parametro);
        break;
    case 'delete':
        appService.eliminar(parametro);
        break;
    default:
        console.log('\n💻 COMANDOS DISPONIBLES EN NEXACORE CLI:');
        console.log('  👉 npm run token:list');
        console.log('  👉 npm run token:generate "NombreProyecto"');
        console.log('  👉 npm run token:delete "NombreProyecto"\n');
}
