'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/app/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Missing or invalid reset link. Please request a new one.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/update-password', { token, new_password: newPassword });
      setSuccess(true);
      setTimeout(() => router.replace('/login'), 3000);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

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
            margin: 0, fontSize: '24px', color: '#4A0F17',
            fontFamily: "var(--font-heading, 'Playfair Display', serif)", fontWeight: 800,
          }}>
            Set New Password
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#8A5A2B', fontWeight: 500 }}>
            Enter your new password below
          </p>
        </div>

        {success ? (
          <div style={{
            textAlign: 'center', padding: '20px',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
              background: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #C6F6D5',
            }}>
              <span style={{ fontSize: '32px' }}>✅</span>
            </div>
            <h3 style={{ color: '#22543D', fontSize: '18px', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
              Password Updated!
            </h3>
            <p style={{ color: '#8A5A2B', fontSize: '14px', margin: 0 }}>
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: 700, color: '#8A5A2B',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px',
              }}>
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
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
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
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
              id="reset-submit"
              type="submit"
              disabled={loading || !token}
              style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: (loading || !token)
                  ? '#A0A0A0'
                  : 'linear-gradient(135deg, #7B1E2B 0%, #4A0F17 100%)',
                color: '#FFF', fontSize: '15px', fontWeight: 700,
                cursor: (loading || !token) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: (loading || !token) ? 'none' : '0 4px 14px rgba(123, 30, 43, 0.25)',
              }}
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <a
                href="/login"
                style={{
                  color: '#7B1E2B', fontSize: '13px', fontWeight: 600,
                  textDecoration: 'underline', textUnderlineOffset: '3px',
                }}
              >
                ← Back to login
              </a>
            </div>
          </form>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #FAF6F0 0%, #F6DCDC 50%, #FFE9E1 100%)',
      }}>
        <p style={{ color: '#8A5A2B', fontWeight: 600 }}>Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
