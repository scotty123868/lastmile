import { useState, type ReactNode, type FormEvent } from 'react';

const AUTH_KEY = 'upskiller_auth';

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'upskiller26') {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthed(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-nav-bg">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-4 rounded-2xl p-8 flex flex-col items-center gap-6 bg-nav-surface border border-nav-border"
      >
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-semibold text-nav-text-active">
            UpSkiller AI
          </h1>
          <p className="text-sm text-nav-text">
            Enter password to continue
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className={`w-full h-10 px-3 rounded-lg text-sm outline-none transition-colors bg-nav-bg text-nav-text-active border ${error ? 'border-red' : 'border-nav-border'}`}
        />

        {error && (
          <p className="text-sm -mt-4 text-red">
            Incorrect password
          </p>
        )}

        <button
          type="submit"
          className="w-full h-10 rounded-lg text-sm font-medium text-white bg-accent transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
