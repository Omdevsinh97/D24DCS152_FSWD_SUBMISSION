import { useState } from 'react';
import FileUpload from './components/FileUpload';
import LogList from './components/LogList';
import LogViewer from './components/LogViewer';
import './App.css';

export default function App() {
  const [selected, setSelected] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ padding: 16 }}>
      <h1>Log Viewer</h1>
      <p>Upload .txt logs and view them below. Errors will be shown inline.</p>
      <FileUpload onUploaded={() => setRefreshKey(x => x + 1)} />
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div style={{ width: 320 }}>
          <LogList key={refreshKey} onSelect={setSelected} />
        </div>
        <div style={{ flex: 1 }}>
          <LogViewer name={selected} />
        </div>
      </div>
    </div>
  );
}
