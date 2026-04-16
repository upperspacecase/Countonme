'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim() || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim() || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center px-8 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-700">self_care</span>
          <span className="text-3xl headline-serif italic text-rose-800">Living Canvas</span>
        </div>
        <h1 className="text-4xl font-headline font-bold text-on-surface leading-tight mt-4">
          {mode === 'signin' ? 'Welcome back.' : 'Start growing.'}
        </h1>
        <p className="text-on-surface-variant font-body mt-2">
          {mode === 'signin' ? 'Sign in to continue your journey.' : 'Create your account to begin.'}
        </p>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl py-3.5 font-body font-semibold text-on-surface hover:bg-surface-container transition-colors mb-4 disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-outline-variant" />
        <span className="text-xs font-body text-outline uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-outline-variant" />
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 font-body text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
        />

        {error && (
          <p className="text-error text-sm font-body">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-secondary text-on-secondary rounded-xl py-3.5 font-body font-bold text-sm tracking-wider uppercase hover:bg-secondary-dim transition-colors disabled:opacity-50"
        >
          {loading ? '...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-on-surface-variant font-body mt-8">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          className="text-secondary font-semibold"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </main>
  );
}
