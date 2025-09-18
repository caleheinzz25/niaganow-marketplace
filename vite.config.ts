import tailwindcss from '@tailwindcss/vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path'
import { WebSocketClient } from 'vite';
export default defineConfig({
  plugins: [
    solidPlugin(), 
    tailwindcss(),
    tanstackRouter({
      target: 'solid',  
      autoCodeSplitting: true,
      verboseFileRoutes: true
    })
  ],
  server: {
    port: 9002,
    allowedHosts: true
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    }
  }
});
