import aplicacion from './Configuracion/app.js';
import { entorno } from './Configuracion/entorno.js';

// Levantar el servidor
aplicacion.listen(entorno.puerto, () => {
    console.log(`🚀 Microservicio ejecutándose en http://localhost:${entorno.puerto}`);
    console.log(`Endpoints disponibles:`);
    console.log(` - POST /api/convertir/excel-a-pdf`);
    console.log(` - GET  /health`);
});
