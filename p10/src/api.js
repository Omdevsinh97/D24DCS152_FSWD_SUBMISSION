export async function apiFetch(url, options) {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      if (contentType.includes('application/json')) {
        const body = await res.json();
        msg = body?.error?.message || msg;
      } else {
        msg = await res.text();
      }
    } catch {}
    throw new Error(msg);
  }
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}
