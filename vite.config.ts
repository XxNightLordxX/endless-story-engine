import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import express from 'express'
import { createApp } from './server/app.js'

// Vite plugin that embeds the Express API server as middleware.
// `npm run dev` starts BOTH frontend and API — no separate server needed.
function apiServerPlugin(): Plugin {
  return {
    name: 'api-server',
    configureServer(server) {
      const { router, storage } = createApp();

      // Create a full Express app so req/res get Express enhancements
      // (Vite middleware passes raw Node objects which lack .json(), .status(), etc.)
      const expressApp = express();
      expressApp.use(express.json());
      expressApp.use(router);

      server.middlewares.use(expressApp);

      console.log(`  API server embedded in Vite dev server`);
      console.log(`  Chapters in storage: ${storage.getChapters().length}`);
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  base: '/endless-story-engine/',
})
