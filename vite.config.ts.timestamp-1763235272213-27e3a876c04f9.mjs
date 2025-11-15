// vite.config.ts
import { defineConfig } from "file:///home/ngangman-teddy/Documents/Projects/Daddy%20robert%20/frontend/node_modules/.pnpm/vite@5.4.21_@types+node@24.10.1_lightningcss@1.30.2/node_modules/vite/dist/node/index.js";
import react from "file:///home/ngangman-teddy/Documents/Projects/Daddy%20robert%20/frontend/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@24.10.1_lightningcss@1.30.2_/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///home/ngangman-teddy/Documents/Projects/Daddy%20robert%20/frontend/node_modules/.pnpm/@tailwindcss+vite@4.1.17_vite@5.4.21_@types+node@24.10.1_lightningcss@1.30.2_/node_modules/@tailwindcss/vite/dist/index.mjs";
import checker from "file:///home/ngangman-teddy/Documents/Projects/Daddy%20robert%20/frontend/node_modules/.pnpm/vite-plugin-checker@0.10.3_eslint@9.39.1_jiti@2.6.1__optionator@0.9.4_typescript@5.8.3__f0586975d18b7a6357a32171ca8ac011/node_modules/vite-plugin-checker/dist/main.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: "dist",
    sourcemap: true
  },
  define: {
    global: "globalThis"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uZ2FuZ21hbi10ZWRkeS9Eb2N1bWVudHMvUHJvamVjdHMvRGFkZHkgcm9iZXJ0IC9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbmdhbmdtYW4tdGVkZHkvRG9jdW1lbnRzL1Byb2plY3RzL0RhZGR5IHJvYmVydCAvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbmdhbmdtYW4tdGVkZHkvRG9jdW1lbnRzL1Byb2plY3RzL0RhZGR5JTIwcm9iZXJ0JTIwL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgdGFpbHdpbmRjc3MoKSxcbiAgICAgICAgY2hlY2tlcih7XG4gICAgICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgICAgICB9KSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwb3J0OiA1MTczLFxuICAgICAgICBob3N0OiB0cnVlLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcbiAgICB9LFxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQWdYLFNBQVMsb0JBQW9CO0FBQzdZLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGFBQWE7QUFHcEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLE1BQ0osWUFBWTtBQUFBLElBQ2hCLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDVjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLFFBQVE7QUFBQSxFQUNaO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
