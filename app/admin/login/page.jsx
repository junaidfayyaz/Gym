'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Dumbbell, ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@gym.com');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password.');

    try {
      setSubmitting(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Admin authentication successful! Redirecting...');
        router.push('/admin');
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (err) {
      toast.error('Network error during admin login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Admin Operations Login</h2>
          <p className="text-xs text-slate-400">Secure entry point for gym management staff</p>
        </div>

        {/* Quick Demo Fill Box */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-center">
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
            ⚡ Quick Demo Admin Credentials
          </span>
          <p className="text-xs font-mono text-slate-300">
            Email: <span className="text-white font-bold">admin@gym.com</span> | Pass: <span className="text-white font-bold">admin123</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@gym.com');
              setPassword('admin123');
              toast.success('Admin credentials autofilled!');
            }}
            className="w-full py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            Autofill Demo Admin Credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Log In to Admin Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
