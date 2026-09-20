/**
 * RMK Textiles — Frontend API & Runtime Configuration
 * 
 * In production on Vercel:
 * - When BACKEND_URL is empty (''), the dashboard automatically uses the relative '/api' endpoint.
 * - If you have deployed an external persistent server (e.g. on Render / Railway), paste the URL below:
 *   e.g. BACKEND_URL: 'https://rmktex-backend.onrender.com'
 */
window.RMK_CONFIG = {
  BACKEND_URL: '',
  SOCKET_URL: ''
};
