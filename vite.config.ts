import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        checker({
            enableBuild: false,
        }),
    ],
    server: {
        host: true,
        port: 5173,
    },
    build: {
        outDir: 'dist',
        target: ['es2021', 'chrome100', 'safari13'],
    },
    base: './',
});
