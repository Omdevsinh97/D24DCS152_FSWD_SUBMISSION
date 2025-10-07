import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_DIR = path.join(__dirname, 'logs');

// Upload and rate limit setup
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const limiter = rateLimit({ windowMs: 60_000, max: 120 });
app.use(limiter);

// Escape HTML to safely render log contents
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (s) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[s]));
}

async function ensureLogsDir() {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
  } catch {
    // ignore mkdir failures; downstream operations will error with proper messages
  }
}

function renderError(message, err) {
  const code = err && err.code ? ` (${err.code})` : '';
  const details = escapeHtml(String(err && err.message ? err.message : err));
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Error</title>
<style>
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; background: #0b1020; color: #e6edf3; }
.container { background:#221a1a33; border:1px solid #aa222233; border-radius:8px; padding:16px; }
pre { background:#1d232f; border:1px solid #27324a; border-radius:6px; padding:12px; overflow:auto; }
a { color:#6cb6ff; }
</style>
</head>
<body>
  <h1>Error</h1>
  <div class="container">
    <p>${escapeHtml(message)}${code}</p>
    <pre>${details}</pre>
    <p><a href="/logs">Back to list</a></p>
  </div>
</body>
</html>`;
}

function jsonError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', async (req, res) => {
  res.redirect('/logs');
});

// List all .txt files in the logs directory
app.get('/logs', async (req, res) => {
  await ensureLogsDir();
  try {
    const entries = await fs.readdir(LOGS_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.txt'))
      .map((e) => e.name)
      .sort();

    const listItems = files.length
      ? files
          .map(
            (name) => `<li><a href="/logs/${encodeURIComponent(name)}">${escapeHtml(name)}</a></li>`
          )
          .join('')
      : '<li><em>No .txt logs found in /logs</em></li>';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Log Viewer</title>
<style>
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; max-width: 900px; margin: auto; background: #0b1020; color: #e6edf3; }
a { color: #6cb6ff; text-decoration: none; }
a:hover { text-decoration: underline; }
h1,h2 { margin: 0 0 12px; }
.container { background:#11162a; border:1px solid #27324a; border-radius:8px; padding:16px; }
ul { margin: 8px 0 0 20px; }
.footer { margin-top: 16px; font-size: 12px; color:#9aa6b2; }
</style>
</head>
<body>
  <h1>Log Viewer</h1>
  <div class="container">
    <h2>Available .txt logs</h2>
    <ul>${listItems}</ul>
  </div>
  <div class="footer">Directory: ${escapeHtml(LOGS_DIR)}</div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    console.error('Failed to list logs:', err);
    res.status(500).send(renderError('Failed to list logs', err));
  }
});

// Render a specific .txt log file
app.get('/logs/:name', async (req, res) => {
  await ensureLogsDir();
  // Prevent path traversal: only use the basename and enforce .txt extension
  const fileName = path.basename(req.params.name);
  const filePath = path.join(LOGS_DIR, fileName);

  if (!fileName.toLowerCase().endsWith('.txt')) {
    return res
      .status(400)
      .send(renderError('Only .txt files are allowed', new Error('Invalid file extension')));
  }

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Log Viewer - ${escapeHtml(fileName)}</title>
<style>
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; max-width: 1100px; margin: auto; background: #0b1020; color: #e6edf3; }
a { color: #6cb6ff; text-decoration: none; }
a:hover { text-decoration: underline; }
h1 { margin: 0 0 12px; }
.header { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.container { background:#11162a; border:1px solid #27324a; border-radius:8px; padding:16px; }
pre { background:#0f1525; border:1px solid #27324a; color:#cdd9e5; padding: 12px; border-radius:6px; overflow:auto; white-space: pre-wrap; }
.meta { margin-bottom: 8px; color:#9aa6b2; font-size: 12px; }
</style>
</head>
<body>
  <div class="header">
    <h1>Viewing: ${escapeHtml(fileName)}</h1>
    <div><a href="/logs">Back to list</a></div>
  </div>
  <div class="container">
    <div class="meta">Path: ${escapeHtml(filePath)}</div>
    <pre>${escapeHtml(content)}</pre>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return res.status(404).send(renderError('File not found', err));
    }
    if (err && (err.code === 'EACCES' || err.code === 'EPERM')) {
      return res.status(403).send(renderError('File is not accessible', err));
    }
    console.error('Failed to read log file:', err);
    return res.status(500).send(renderError('Failed to read log file', err));
  }
});

// JSON API: list log files
app.get('/api/logs', async (req, res) => {
  await ensureLogsDir();
  try {
    const entries = await fs.readdir(LOGS_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.txt'))
      .map((e) => e.name)
      .sort();
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: { code: err?.code || 'EUNKNOWN', message: 'Failed to list logs' } });
  }
});

// JSON API: get a specific file's contents
app.get('/api/logs/:name', async (req, res) => {
  await ensureLogsDir();
  const fileName = path.basename(req.params.name);
  if (!fileName.toLowerCase().endsWith('.txt')) {
    return jsonError(res, 400, 'EINVALID', 'Only .txt files allowed');
  }
  const filePath = path.join(LOGS_DIR, fileName);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    res.json({ name: fileName, content });
  } catch (err) {
    if (err && err.code === 'ENOENT') return jsonError(res, 404, 'ENOTFOUND', 'File not found');
    if (err && (err.code === 'EACCES' || err.code === 'EPERM')) return jsonError(res, 403, 'EACCESS', 'File not accessible');
    res.status(500).json({ error: { code: err?.code || 'EUNKNOWN', message: 'Failed to read file' } });
  }
});

// Raw API: get raw text (for large files/streaming in clients)
app.get('/api/logs/:name/raw', async (req, res) => {
  await ensureLogsDir();
  const fileName = path.basename(req.params.name);
  if (!fileName.toLowerCase().endsWith('.txt')) {
    return jsonError(res, 400, 'EINVALID', 'Only .txt files allowed');
  }
  const filePath = path.join(LOGS_DIR, fileName);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(filePath, (err) => {
    if (!err) return;
    if (err && err.code === 'ENOENT') return jsonError(res, 404, 'ENOTFOUND', 'File not found');
    if (err && (err.code === 'EACCES' || err.code === 'EPERM')) return jsonError(res, 403, 'EACCESS', 'File not accessible');
    res.status(500).json({ error: { code: err?.code || 'EUNKNOWN', message: 'Failed to read file' } });
  });
});

// Upload API: accept a single .txt file
app.post('/api/logs', upload.single('file'), async (req, res) => {
  await ensureLogsDir();
  if (!req.file) return jsonError(res, 400, 'ENOFIELD', 'No file uploaded (field name should be "file")');
  const original = req.file.originalname || 'upload.txt';
  const safeName = path.basename(original);
  if (!safeName.toLowerCase().endsWith('.txt')) return jsonError(res, 400, 'EINVALID', 'Only .txt files allowed');
  const dest = path.join(LOGS_DIR, safeName);
  try {
    await fs.writeFile(dest, req.file.buffer, { flag: 'w' });
    res.status(201).json({ ok: true, file: safeName });
  } catch (err) {
    if (err && (err.code === 'EACCES' || err.code === 'EPERM')) return jsonError(res, 403, 'EACCESS', 'Cannot write file');
    res.status(500).json({ error: { code: err?.code || 'EUNKNOWN', message: 'Failed to save file' } });
  }
});

app.listen(PORT, () => {
  console.log(`Log viewer server listening on http://localhost:${PORT}`);
  console.log(`Place .txt files in: ${LOGS_DIR}`);
});
