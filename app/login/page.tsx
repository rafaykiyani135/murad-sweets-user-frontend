'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  // If already authenticated, redirect to /history
  useEffect(() => {
    api.get('/auth/me')
      .then(() => router.replace('/history'))
      .catch(() => setCheckingSession(false));
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/login', { email, password });
      router.replace('/history');
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMessage(res.data.message || 'If that email is registered, a reset link has been sent.');
    } catch {
      setForgotMessage('If that email is registered, a reset link has been sent.');
    } finally {
      setForgotLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #FAF6F0 0%, #F6DCDC 50%, #FFE9E1 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid #E8C8C8', borderTopColor: '#7B1E2B',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#8A5A2B', fontWeight: 600 }}>Checking session...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, #FAF6F0 0%, #F6DCDC 50%, #FFE9E1 100%)',
      padding: '20px',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,30,43,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-15%', left: '-5%', width: '400px', height: '400px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,163,65,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(232, 200, 200, 0.6)',
        boxShadow: '0 20px 60px rgba(74, 15, 23, 0.1), 0 1px 3px rgba(74, 15, 23, 0.05)',
        padding: '44px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, #7B1E2B 0%, #D4A341 50%, #7B1E2B 100%)',
        }} />

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #7B1E2B 0%, #4A0F17 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(123, 30, 43, 0.3)',
          }}>
            <span style={{ fontSize: '24px', color: '#D4A341', fontWeight: 800, fontFamily: 'serif' }}>M</span>
          </div>
          <h1 style={{
            margin: 0, fontSize: '26px', color: '#4A0F17',
            fontFamily: "var(--font-heading, 'Playfair Display', serif)", fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            Murad Sweets
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#8A5A2B', fontWeight: 500 }}>
            Admin Dashboard
          </p>
        </div>

        {!showForgot ? (
          /* ─── Login Form ─── */
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: 700, color: '#8A5A2B',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
              }}>
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@muradsweets.com"
                autoComplete="email"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '10px',
                  border: '1px solid #E8C8C8', background: '#FAFAFA',
                  color: '#4A0F17', fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#7B1E2B'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(123,30,43,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#E8C8C8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: 700, color: '#8A5A2B',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '10px',
                  border: '1px solid #E8C8C8', background: '#FAFAFA',
                  color: '#4A0F17', fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#7B1E2B'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(123,30,43,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#E8C8C8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                background: '#FFF4F4', border: '1px solid #FECACA', color: '#991B1B',
                fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: loading
                  ? '#A0A0A0'
                  : 'linear-gradient(135deg, #7B1E2B 0%, #4A0F17 100%)',
                color: '#FFF', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(123, 30, 43, 0.25)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => { setShowForgot(true); setError(''); setForgotMessage(''); }}
                style={{
                  background: 'none', border: 'none', color: '#7B1E2B', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Forgot your password?
              </button>
            </div>
          </form>
        ) : (
          /* ─── Forgot Password Form ─── */
          <form onSubmit={handleForgotPassword}>
            <p style={{ color: '#8A5A2B', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Enter your admin email address and we&apos;ll send you a link to reset your password.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: 700, color: '#8A5A2B',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
              }}>
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="admin@muradsweets.com"
                autoComplete="email"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '10px',
                  border: '1px solid #E8C8C8', background: '#FAFAFA',
                  color: '#4A0F17', fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#7B1E2B'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(123,30,43,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#E8C8C8'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {forgotMessage && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                background: '#F0FFF4', border: '1px solid #C6F6D5', color: '#22543D',
                fontSize: '13px', fontWeight: 600,
              }}>
                ✅ {forgotMessage}
              </div>
            )}

            <button
              id="forgot-submit"
              type="submit"
              disabled={forgotLoading}
              style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: forgotLoading
                  ? '#A0A0A0'
                  : 'linear-gradient(135deg, #7B1E2B 0%, #4A0F17 100%)',
                color: '#FFF', fontSize: '15px', fontWeight: 700,
                cursor: forgotLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: forgotLoading ? 'none' : '0 4px 14px rgba(123, 30, 43, 0.25)',
              }}
            >
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotMessage(''); }}
                style={{
                  background: 'none', border: 'none', color: '#7B1E2B', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                ← Back to login
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
