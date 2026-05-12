'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('amirkazi84088@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return }
      router.push('/admin/dashboard')
    } catch { setError('Network error'); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes orbF{0%,100%{transform:scale(1) translate(0,0)}50%{transform:scale(1.1) translate(20px,-20px)}}`}</style>
      <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle,rgba(0,212,255,.1),transparent 70%)', top: -100, right: -100, borderRadius: '50%', animation: 'orbF 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle,rgba(123,47,255,.1),transparent 70%)', bottom: -50, left: -50, borderRadius: '50%', animation: 'orbF 10s ease-in-out infinite reverse' }} />
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '3rem', width: '100%', maxWidth: 420, position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3))' }} />
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--heading)', fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '.5rem' }}>AK.</div>
          <h1 style={{ fontFamily: 'var(--heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '.5rem' }}>Admin Login</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Only Amir can enter here 🔐</p>
        </div>
        {error && <div style={{ background: 'rgba(255,45,120,.1)', border: '1px solid rgba(255,45,120,.3)', borderRadius: 8, padding: '.8rem 1rem', fontSize: '.85rem', color: '#ff2d78', marginBottom: '1.5rem' }}>⚠️ {error}</div>}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '.72rem', color: 'var(--muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.5rem' }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '.85rem 1rem', color: 'var(--text)', fontSize: '.9rem', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '.72rem', color: 'var(--muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.5rem' }}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} type="password" placeholder="Enter your password" style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '.85rem 1rem', color: 'var(--text)', fontSize: '.9rem', outline: 'none' }} />
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,var(--accent),var(--accent2))', border: 'none', borderRadius: 8, padding: '.95rem', color: '#fff', fontWeight: 700, fontSize: '.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, transition: 'all .3s', letterSpacing: '.05em' }}>
          {loading ? 'Logging in...' : 'Login to Admin Panel →'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.78rem', color: 'var(--muted)' }}>
          ← <a href="/" style={{ color: 'var(--accent)' }}>Back to Portfolio</a>
        </p>
      </div>
    </div>
  )
}
