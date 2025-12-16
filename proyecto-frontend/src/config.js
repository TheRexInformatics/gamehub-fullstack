// frontend/src/config.js - VERSIÓN CORREGIDA
// ============================================

// 1. Definimos las URLs directamente (sin usar 'window' aquí)
const BACKEND_URL_PRODUCTION = "https://gamehub-fullstack.onrender.com";
const BACKEND_URL_DEVELOPMENT = "http://localhost:5000";

// 2. SOLO en el navegador, decidimos cuál usar
let API_URL = BACKEND_URL_PRODUCTION; // Valor por defecto seguro para el build

// 3. Esta parte SOLO se ejecuta en el navegador (no durante el build de Vercel)
if (typeof window !== 'undefined') {
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  API_URL = isLocalhost ? BACKEND_URL_DEVELOPMENT : BACKEND_URL_PRODUCTION;
  
  // 4. El console.log también SOLO en el navegador
  console.log(`🔧 GameHub Config:
    Entorno: ${isLocalhost ? 'Desarrollo Local' : 'Producción'}
    Backend URL: ${API_URL}
    Frontend URL: ${window.location.origin}
  `);
}

// 5. Exportamos
export { API_URL };