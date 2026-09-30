// server.js — punto de entrada real (separa listen de app para no romper los tests)
const app = require('./app'); // reutiliza la app ya configurada

const PORT = process.env.PORT || 3000; // puerto configurable por env
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`)); // levanta el servidor
