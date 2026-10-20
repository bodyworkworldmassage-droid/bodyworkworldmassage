'use client';
import { useState } from 'react';

export default function LoginGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/dashboard-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.reload();
    } else {
      setError('Incorrect password. Please try again.');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f0f4f8', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400,
        boxShadow: '0 4px 24px rgba(0,0,0,.10)', textAlign: 'center',
      }}>
        <div style={{
          width: 52, height: 52, background: '#0f1b2d', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 22,
        }}>📊</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Enter your password to access analytics</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Dashboard password"
            required
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #d1d5db',
              fontSize: 14, marginBottom: 14, outline: 'none', boxSizing: 'border-box',
              background: '#f9fafb', color: '#111',
            }}
          />
          {error && (
            <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, textAlign: 'left' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: 8, border: 'none',
              background: '#1a5fb4', color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1,
            }}
          >
            {loading ? 'Checking…' : 'Access Dashboard'}
          </button>
        </form>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 20 }}>
          <a href="/" style={{ color: '#1a5fb4', textDecoration: 'none' }}>← Back to website</a>
        </p>
      </div>
    </div>
  );
}
