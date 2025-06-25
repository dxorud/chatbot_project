import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           
    strictPort: true,     
    cors: true,           
    allowedHosts: [
      'bass-worthy-actively.ngrok-free.app',   
    ],
    port: 5173          
  }
});
