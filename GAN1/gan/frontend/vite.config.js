import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      // Expose environment variables to the app
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID)
    },
    plugins: [react()],
    // Optional: Add any additional configuration
    server: {
      port: 5173,
      open: true
    }
  }
});
