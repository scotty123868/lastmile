import { useState, type ReactNode, type FormEvent } from 'react';

const AUTH_KEY = 'upskiller_auth';

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  if (authed) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'upskiller26') {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthed(true);
    } else {
      setError(true);
      setShaking(true);
      setPassword('');
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Subtle gradient orbs */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%', width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <form
        onSubmit={handleSubmit}
        style={{
          position: 'relative', zIndex: 1, width: '100%', maxWidth: '380px', margin: '0 16px',
          padding: '40px 32px', borderRadius: '20px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
          display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '28px',
          animation: shaking ? 'shake 0.5s ease-in-out' : undefined,
        }}
      >
        {/* Logo mark */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '22px', fontWeight: 600, color: '#fafafa', margin: 0,
            letterSpacing: '-0.02em',
          }}>
            UpSkiller AI
          </h1>
          <p style={{
            fontSize: '14px', color: '#6b7280', margin: '6px 0 0', fontWeight: 400,
          }}>
            Last Mile Operations
          </p>
        </div>

        <div style={{ width: '100%' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Enter password"
            autoFocus
            style={{
              width: '100%', height: '44px', padding: '0 14px', borderRadius: '12px',
              fontSize: '14px', color: '#fafafa', outline: 'none',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box' as const,
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)';
              e.currentTarget.style.boxShadow = error
                ? '0 0 0 3px rgba(239,68,68,0.1)'
                : '0 0 0 3px rgba(16,185,129,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {error && (
            <p style={{ fontSize: '13px', color: '#ef4444', margin: '8px 0 0', textAlign: 'center' }}>
              Incorrect password
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%', height: '44px', borderRadius: '12px', border: 'none',
            fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
          }}
        >
          Continue
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        input::placeholder { color: #52525b; }
      `}</style>
    </div>
  );
}
