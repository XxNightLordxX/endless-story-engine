import express from 'express';
import cors from 'cors';
import { createApp } from './app.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { router, storage } = createApp();
app.use(router);

app.listen(PORT, () => {
  console.log(`\n  Endless Story Engine API running on http://localhost:${PORT}`);
  console.log(`  API Key: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'NOT SET — use /api/admin/set-api-key or ANTHROPIC_API_KEY env var'}`);
  console.log(`  Chapters in storage: ${storage.getChapters().length}\n`);
});
