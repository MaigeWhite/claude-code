import cors from 'cors';
import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'agentkit-backend' });
});

app.post('/api/v1/chat/messages', (req, res) => {
  const { session_id, message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'message is required', request_id: `req_${Date.now()}` } });
  }
  return res.json({ run_id: `run_${Date.now()}`, session_id: session_id || `sess_${Date.now()}`, accepted: true });
});

app.get('/api/v1/chat/runs/:runId/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const events = [
    { type: 'thinking', content: '正在分析需求...' },
    { type: 'tool_start', call_id: 'c1', tool: 'analyze_request', args: { mode: 'auto' } },
    { type: 'tool_done', call_id: 'c1', tool: 'analyze_request', summary: '任务拆解完成', elapsed_ms: 900 },
    { type: 'text_delta', content: '任务已受理，正在处理。' },
    { type: 'text_done' },
    { type: 'done', iterations: 1, tool_calls: 1, elapsed_ms: 1200 }
  ];

  let i = 0;
  const timer = setInterval(() => {
    if (i >= events.length) {
      clearInterval(timer);
      res.end();
      return;
    }
    res.write(`data: ${JSON.stringify(events[i])}\n\n`);
    i += 1;
  }, 600);

  req.on('close', () => clearInterval(timer));
});

app.post('/api/v1/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'file is required', request_id: `req_${Date.now()}` } });
  }
  return res.json({ file_id: `file_${Date.now()}`, name: req.file.originalname, size: req.file.size });
});

app.get('/api/v1/artifacts/:artifactId', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.artifactId}.txt"`);
  res.send('artifact content');
});

app.listen(port, () => console.log(`agentkit backend on :${port}`));
