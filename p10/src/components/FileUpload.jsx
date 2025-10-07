import { useState } from 'react';
import { apiFetch } from '../api';

export default function FileUpload({ onUploaded }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleChange(e) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setError('Only .txt files are allowed');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    setBusy(true);
    try {
      await apiFetch('/api/logs', { method: 'POST', body: form });
      onUploaded?.();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="file" accept=".txt" onChange={handleChange} disabled={busy} />
      {busy && <span>Uploading…</span>}
      {error && <div style={{ color: 'salmon' }}>{error}</div>}
    </div>
  );
}
