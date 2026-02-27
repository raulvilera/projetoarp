// vite.config.ts
import { defineConfig } from "file:///C:/Users/raul_/OneDrive%20-%20Academico%20-%20Secretaria%20do%20Estado%20da%20Educa%C3%A7%C3%A3o%20de%20S%C3%A3o%20Paulo/%C3%81rea%20de%20Trabalho/Projeto%20Avalia%C3%A7%C3%A3o%20dos%20Riscos%20Psicossociais/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/raul_/OneDrive%20-%20Academico%20-%20Secretaria%20do%20Estado%20da%20Educa%C3%A7%C3%A3o%20de%20S%C3%A3o%20Paulo/%C3%81rea%20de%20Trabalho/Projeto%20Avalia%C3%A7%C3%A3o%20dos%20Riscos%20Psicossociais/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/raul_/OneDrive%20-%20Academico%20-%20Secretaria%20do%20Estado%20da%20Educa%C3%A7%C3%A3o%20de%20S%C3%A3o%20Paulo/%C3%81rea%20de%20Trabalho/Projeto%20Avalia%C3%A7%C3%A3o%20dos%20Riscos%20Psicossociais/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\raul_\\OneDrive - Academico - Secretaria do Estado da Educa\xE7\xE3o de S\xE3o Paulo\\\xC1rea de Trabalho\\Projeto Avalia\xE7\xE3o dos Riscos Psicossociais";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyYXVsX1xcXFxPbmVEcml2ZSAtIEFjYWRlbWljbyAtIFNlY3JldGFyaWEgZG8gRXN0YWRvIGRhIEVkdWNhXHUwMEU3XHUwMEUzbyBkZSBTXHUwMEUzbyBQYXVsb1xcXFxcdTAwQzFyZWEgZGUgVHJhYmFsaG9cXFxcUHJvamV0byBBdmFsaWFcdTAwRTdcdTAwRTNvIGRvcyBSaXNjb3MgUHNpY29zc29jaWFpc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccmF1bF9cXFxcT25lRHJpdmUgLSBBY2FkZW1pY28gLSBTZWNyZXRhcmlhIGRvIEVzdGFkbyBkYSBFZHVjYVx1MDBFN1x1MDBFM28gZGUgU1x1MDBFM28gUGF1bG9cXFxcXHUwMEMxcmVhIGRlIFRyYWJhbGhvXFxcXFByb2pldG8gQXZhbGlhXHUwMEU3XHUwMEUzbyBkb3MgUmlzY29zIFBzaWNvc3NvY2lhaXNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3JhdWxfL09uZURyaXZlJTIwLSUyMEFjYWRlbWljbyUyMC0lMjBTZWNyZXRhcmlhJTIwZG8lMjBFc3RhZG8lMjBkYSUyMEVkdWNhJUMzJUE3JUMzJUEzbyUyMGRlJTIwUyVDMyVBM28lMjBQYXVsby8lQzMlODFyZWElMjBkZSUyMFRyYWJhbGhvL1Byb2pldG8lMjBBdmFsaWElQzMlQTclQzMlQTNvJTIwZG9zJTIwUmlzY29zJTIwUHNpY29zc29jaWFpcy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGNvbXBvbmVudFRhZ2dlcigpXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMnFCLFNBQVMsb0JBQW9CO0FBQ3hzQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
