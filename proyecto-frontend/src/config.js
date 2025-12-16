// frontend/src/config.js
// ============================================
// CONFIGURACIÓN PARA GAMEHUB - DESARROLLO Y PRODUCCIÓN
// ============================================

// Detectar automáticamente si estamos en localhost
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

// URL de tu backend desplegado en Render
const BACKEND_URL_PRODUCTION = "https://gamehub-fullstack.onrender.com";

// URL para desarrollo local
const BACKEND_URL_DEVELOPMENT = "http://localhost:5000";

// Exportar la URL correcta según el entorno
export const API_URL = isLocalhost 
  ? BACKEND_URL_DEVELOPMENT    // Desarrollo local
  : BACKEND_URL_PRODUCTION;    // Producción en Render

// Opcional: Mostrar en consola para depuración
console.log(`🔧 GameHub Config:
  Entorno: ${isLocalhost ? 'Desarrollo Local' : 'Producción'}
  Backend URL: ${API_URL}
  Frontend URL: ${window.location.origin}
`);