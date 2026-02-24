import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import githubRouter from './routes/github';
import resumeRouter from './routes/resume';
import templatesRouter from './routes/templates';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env['PORT'] ?? 3001;
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173';

/* ── Middleware ── */
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

/* ── Routes ── */
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'buildme 서버가 정상 동작 중입니다.' });
});

app.use('/api/auth', authRouter);
app.use('/api/github', githubRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/templates', templatesRouter);

/* ── Error Handler ── */
app.use(errorHandler);

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`✓ buildme 서버 시작: http://localhost:${PORT}`);
});
