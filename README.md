# NexaCore Services - Manual de Administración CLI

Este microservicio cuenta con un CLI (Command Line Interface) integrado para gestionar por completo la configuración y seguridad desde cualquier terminal de servidor (Windows CMD, PowerShell o Linux bash) sin necesidad de editar manualmente el código o el archivo `.env`.

---

## 🛡️ 1. GESTIÓN DE SEGURIDAD (API KEYS)

El sistema utiliza un diccionario de tokens para cada proyecto autorizado.

### Listar Tokens
Muestra los proyectos y sus llaves con acceso al microservicio.
```bash
npm run token:list
```

### Generar Token
Crea una llave criptográfica segura y la asocia a un proyecto.
```bash
npm run token:generate "NombreDelProyecto"
# Ejemplo: npm run token:generate "NexaCoreApi"
```

### Revocar Token
Elimina el acceso a un proyecto de forma inmediata.
```bash
npm run token:delete "NombreDelProyecto"
# Ejemplo: npm run token:delete "NexaCoreApi"
```

---

## 🌐 2. GESTIÓN DE RED Y CORS

Para garantizar la seguridad, solo los dominios autorizados pueden consumir el microservicio desde el navegador.

### Listar Orígenes CORS
Muestra las URLs autorizadas actualmente.
```bash
npm run cors:list
```

### Añadir Origen CORS
Autoriza una nueva IP o Dominio.
```bash
npm run cors:add "http://192.168.1.100:8000"
```

### Eliminar Origen CORS
Revoca los permisos de comunicación en el navegador para una IP o Dominio.
```bash
npm run cors:remove "http://192.168.1.100:8000"
```

---

## 🔌 3. GESTIÓN DEL PUERTO

### Cambiar Puerto
Reconfigura el puerto principal del servicio
```bash
npm run config:port 8192
```

---

> **⚠️ RECORDATORIO CRÍTICO:**
> Las variables de entorno son cargadas en la memoria (RAM) al iniciar Node.js. 
> Siempre que ejecutes un comando para **Generar/Eliminar Tokens, Cambiar Puertos o Modificar CORS**, DEBES REINICIAR el servicio (con `npm run dev`, o tu orquestador PM2 / NSSM en Windows) para que el cambio aplique en el sistema.
