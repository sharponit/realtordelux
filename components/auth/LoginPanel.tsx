'use client';

import { FormEvent, useState } from 'react';
import { signInWithMagicLink, signInWithOAuth, signInWithPassword } from '@/lib/supabase/auth';

const oauthButtons = [
  { label: 'Continue with Google', provider: 'google' },
  { label: 'Continue with Apple', provider: 'apple' },
  { label: 'Continue with Microsoft', provider: 'azure' }
] as const;

export function LoginPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const result =
      mode === 'magic' ? await signInWithMagicLink(email) : await signInWithPassword(email, password);

    setIsLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(
      mode === 'magic'
        ? 'Secure magic link sent. Please check your email.'
        : 'Login successful. Redirecting securely...'
    );
  }

  async function handleOAuth(provider: 'google' | 'apple' | 'azure') {
    setIsLoading(true);
    setMessage('');
    const { error } = await signInWithOAuth(provider);

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(23,23,23,0.09)] md:p-9">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
          Continue Securely
        </p>
        <h1 className="font-display mt-4 text-4xl leading-tight">Private access to Viyra</h1>
        <p className="mt-4 text-sm leading-7 text-taupe">
          Sign in to manage private property searches, professional workflows, firm seats, and
          verified transaction rooms.
        </p>
      </div>

      <div className="space-y-3">
        {oauthButtons.map((button) => (
          <button
            className="w-full border border-black/10 px-5 py-4 text-sm font-semibold text-black transition hover:border-gold hover:bg-porcelain"
            disabled={isLoading}
            key={button.provider}
            onClick={() => handleOAuth(button.provider)}
            type="button"
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-taupe">Email access</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <div className="mb-4 grid grid-cols-2 border border-black/10 text-xs font-bold uppercase tracking-[0.14em]">
        <button
          className={`px-4 py-3 ${mode === 'password' ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={() => setMode('password')}
          type="button"
        >
          Email Login
        </button>
        <button
          className={`px-4 py-3 ${mode === 'magic' ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={() => setMode('magic')}
          type="button"
        >
          Magic Link
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleEmailSubmit}>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
            Email address
          </span>
          <input
            className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-4 text-sm outline-none transition focus:border-gold"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            required
            type="email"
            value={email}
          />
        </label>

        {mode === 'password' ? (
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
              Password
            </span>
            <input
              className="mt-2 w-full border border-black/10 bg-porcelain px-4 py-4 text-sm outline-none transition focus:border-gold"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
        ) : null}

        <button
          className="w-full bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#b99655]"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Securing access...' : mode === 'magic' ? 'Send Magic Link' : 'Continue Securely'}
        </button>
      </form>

      {message ? <p className="mt-5 text-center text-sm text-taupe">{message}</p> : null}

      <p className="mt-7 text-center text-xs leading-6 text-black/45">
        No entertainment social logins. Viyra uses professional identity providers and secure email
        authentication only.
      </p>
    </div>
  );
}
