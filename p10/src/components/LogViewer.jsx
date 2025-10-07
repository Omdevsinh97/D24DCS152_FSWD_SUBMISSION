import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function LogViewer({ name }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) return;
    setError('');
    setContent('');
    apiFetch(`/api/logs/${encodeURIComponent(name)}`)
      .then(data => setContent(data.content || ''))
      .catch(err => setError(err.message || 'Failed to load file'));
  }, [name]);

  if (!name) return <div>Select a log to view</div>;
  return (
    <div>
      <h3>{name}</h3>
      {error && <div style={{ color: 'salmon' }}>{error}</div>}
      {!error && <pre style={{ whiteSpace: 'pre-wrap', background: '#0f1525', color: '#cdd9e5', padding: 12, borderRadius: 6 }}>{content}</pre>}
    </div>
  );
}
