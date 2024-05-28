import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom'], // Asegúrate de incluir React y ReactDOM aquí
  },
})
