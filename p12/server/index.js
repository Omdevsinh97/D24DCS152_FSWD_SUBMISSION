import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Simple health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Helper to validate and parse numbers
function toNumber(value) {
  if (value === null || value === undefined || value === '') return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

// POST /api/calc { a, b, op }
app.post('/api/calc', (req, res) => {
  const { a, b, op } = req.body || {};

  const n1 = toNumber(a);
  const n2 = toNumber(b);

  if (!['add', 'subtract', 'multiply', 'divide'].includes(op)) {
    return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, or divide.' });
  }

  if (!Number.isFinite(n1) || !Number.isFinite(n2)) {
    return res.status(400).json({ error: 'Invalid inputs. Please provide valid numbers for a and b.' });
  }

  if (op === 'divide' && n2 === 0) {
    return res.status(400).json({ error: 'Division by zero is not allowed.' });
  }

  let result;
  switch (op) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      result = n1 / n2;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported operation.' });
  }

  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Calculator API listening on http://localhost:${PORT}`);
});
