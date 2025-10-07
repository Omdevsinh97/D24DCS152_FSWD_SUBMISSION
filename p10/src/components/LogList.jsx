import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function LogList({ onSelect }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const data = await apiFetch('/api/logs');
      setFiles(data.files || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch file list');
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h3>Logs</h3>
      {error && <div style={{ color: 'salmon' }}>{error}</div>}
      <ul style={{ paddingLeft: 16 }}>
        {files.map(name => (
          <li key={name}>
            <button onClick={() => onSelect(name)}>{name}</button>
          </li>
        ))}
      </ul>
      <button onClick={load} style={{ marginTop: 8 }}>Refresh</button>
    </div>
  );
}
