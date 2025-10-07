import { useState } from 'react'
import './App.css'

function App() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [op, setOp] = useState('add')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const ops = [
    { value: 'add', label: 'Add (+)' },
    { value: 'subtract', label: 'Subtract (−)' },
    { value: 'multiply', label: 'Multiply (×)' },
    { value: 'divide', label: 'Divide (÷)' },
  ]

  function toNumber(v) {
    if (v === null || v === undefined || v === '') return NaN
    const n = Number(v)
    return Number.isFinite(n) ? n : NaN
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    const n1 = toNumber(a)
    const n2 = toNumber(b)

    if (!Number.isFinite(n1) || !Number.isFinite(n2)) {
      setError('Please enter valid numbers in both boxes.')
      return
    }
    if (op === 'divide' && n2 === 0) {
      setError('Division by zero is not allowed.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: a.trim(), b: b.trim(), op }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }

      setResult(data.result)
    } catch (err) {
      setError('Unable to reach the calculator service. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '2rem auto', padding: '1.5rem', background: '#fff', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Kids Calculator</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            First number
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="e.g., 12"
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '1rem', marginTop: 6 }}
            />
          </label>

          <label>
            Second number
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="e.g., 3"
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '1rem', marginTop: 6 }}
            />
          </label>

          <label>
            Operation
            <select
              value={op}
              onChange={(e) => setOp(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '1rem', marginTop: 6 }}
            >
              {ops.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '1.1rem',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Calculating…' : 'Calculate'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: '#b91c1c', background: '#fee2e2', padding: '0.75rem', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {result !== null && !error && (
        <div style={{ marginTop: '1rem', color: '#065f46', background: '#d1fae5', padding: '0.75rem', borderRadius: 8 }}>
          Result: <strong>{result}</strong>
        </div>
      )}
    </div>
  )
}

export default App
