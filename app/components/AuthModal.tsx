'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'login' | 'register';
type RegisterTab = 'default' | 'provider';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [view, setView] = useState<View>('login');
  const [registerTab, setRegisterTab] = useState<RegisterTab>('default');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form state
  const [reg, setReg] = useState({
    first_name: '', last_name: '', username: '', email: '', password: '', confirm_password: '',
    phone: '', date_of_birth: '', instagram_url: '', website: '', bio: '',
    terms_accepted: false, gdpr_accepted: false,
  });

  useEffect(() => {
    if (!isOpen) {
      setView('login');
      setLoginError('');
      setRegisterError('');
      setRegisterSuccess('');
      setLoginId('');
      setLoginPass('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    const result = await login(loginId, loginPass);
    setLoading(false);
    if (result.error) {
      setLoginError(result.error);
    } else {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reg,
        account_type: registerTab,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setRegisterError(data.error || 'Registration failed.');
    } else {
      setRegisterSuccess(data.message || 'Registration submitted!');
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {view === 'login' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#1a3a2a] mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username or Email"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a3a2a] text-white rounded-full py-2.5 text-sm font-semibold hover:bg-[#14301f] disabled:opacity-60"
              >
                {loading ? 'Logging in…' : 'LOGIN'}
              </button>
              <div className="flex justify-between text-sm text-gray-500">
                <button type="button" className="hover:underline">Forgot Password?</button>
                <button type="button" onClick={() => setView('register')} className="text-blue-600 hover:underline">Register</button>
              </div>
            </form>
          </div>
        )}

        {view === 'register' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#1a3a2a] mb-4">Create Account</h2>

            {registerSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <p className="text-green-800 font-semibold text-sm">{registerSuccess}</p>
                <button type="button" onClick={() => setView('login')} className="mt-4 text-blue-600 text-sm hover:underline">
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-5">
                  {(['default', 'provider'] as RegisterTab[]).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRegisterTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize ${registerTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="First Name" value={reg.first_name} onChange={e => setReg(r => ({ ...r, first_name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input placeholder="Last Name" value={reg.last_name} onChange={e => setReg(r => ({ ...r, last_name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <input placeholder="Username" value={reg.username} onChange={e => setReg(r => ({ ...r, username: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  <input type="email" placeholder="Email" value={reg.email} onChange={e => setReg(r => ({ ...r, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={reg.password}
                      onChange={e => setReg(r => ({ ...r, password: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={reg.confirm_password}
                    onChange={e => setReg(r => ({ ...r, confirm_password: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                  {registerTab === 'provider' && (
                    <>
                      <input placeholder="Phone" value={reg.phone} onChange={e => setReg(r => ({ ...r, phone: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="date" placeholder="Date of Birth" value={reg.date_of_birth} onChange={e => setReg(r => ({ ...r, date_of_birth: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input placeholder="Instagram URL" value={reg.instagram_url} onChange={e => setReg(r => ({ ...r, instagram_url: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input placeholder="Website" value={reg.website} onChange={e => setReg(r => ({ ...r, website: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <label className="flex items-start gap-2 text-sm text-gray-600">
                        <input type="checkbox" checked={reg.gdpr_accepted} onChange={e => setReg(r => ({ ...r, gdpr_accepted: e.target.checked }))} className="mt-0.5" />
                        I accept the GDPR data processing terms
                      </label>
                    </>
                  )}

                  <label className="flex items-start gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={reg.terms_accepted} onChange={e => setReg(r => ({ ...r, terms_accepted: e.target.checked }))} className="mt-0.5" required />
                    I accept the Terms of Service
                  </label>

                  {registerError && <p className="text-red-500 text-sm">{registerError}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-full py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? 'Creating account…' : 'CREATE ACCOUNT'}
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setView('login')} className="text-blue-600 hover:underline">Login</button>
                  </p>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
