# NexaCore Services - CLI de Seguridad

Este microservicio cuenta con un CLI (Command Line Interface) integrado bajo arquitectura limpia para gestionar los tokens de acceso (`API_KEYS`) directamente desde la consola, ideal para servidores en producción (Windows/Linux) sin necesidad de tocar el código fuente o editar archivos manualmente.

## 💻 Comandos Disponibles

### 1. Listar Tokens Activos
Muestra todos los tokens que actualmente tienen permisos para consumir los endpoints protegidos del microservicio.

```bash
npm run token:list
```

### 2. Generar un Nuevo Token
Crea una nueva llave criptográfica segura, la vincula al nombre de un proyecto y la inyecta automáticamente en tu archivo `.env`.

**Sintaxis:** `npm run token:generate "<NombreDelProyecto>"`
**Ejemplo:**
```bash
npm run token:generate "CRM_Ventas"
```
*(Resultado esperado: `nx_live_crmventas_8f7b34d2a1c9e...`)*

### 3. Revocar (Eliminar) un Token
Elimina por completo la llave de un proyecto específico, revocándole el acceso al microservicio.

**Sintaxis:** `npm run token:delete "<NombreDelProyecto>"`
**Ejemplo:**
```bash
npm run token:delete "CRM_Ventas"
```

---

> **⚠️ RECORDATORIO TÉCNICO:**
> Las variables de entorno son inyectadas en la memoria de Node.js al momento del arranque. Siempre que **generes** o **elimines** un token, debes reiniciar el servicio (`npm run dev`, o reiniciar el servicio en PM2/Windows Services) para aplicar la nueva política de seguridad.
