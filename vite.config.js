import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  plugins: [vue()],
  build:{
    rollupOptions: {
      output: {
        manualChunks: {
         "agora-rtm": ["agora-rtm-sdk"],
          "agora-rtc": ["agora-rtc-sdk-ng"],
        }
      }
    }
  }
});
