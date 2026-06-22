/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck, Database } from 'lucide-react';
import { dbMode } from '../lib/supabase';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  // Read admin credentials from env, or resolve default test ones
  const targetUsername = (import.meta as any).env.VITE_ADMIN_USERNAME || 'admin';
  const targetPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'admin-portal-2026';

  useEffect(() => {
    // If already authorized, redirect instantly to dashboard
    const isAuth = sessionStorage.getItem('job_portal_admin_authenticated') === 'true';
    if (isAuth) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please input both username and password.');
      return;
    }

    setIsLoggingIn(true);

    // Simulate standard JWT/Session credential validation delay
    setTimeout(() => {
      const matchUser = username.trim() === targetUsername;
      const matchPass = password.trim() === targetPassword;

      if (matchUser && matchPass) {
        // Authenticated! Store secure token inside session (cleared on tab close)
        sessionStorage.setItem('job_portal_admin_authenticated', 'true');
        sessionStorage.setItem('job_portal_admin_user', username.trim());
        sessionStorage.setItem('job_portal_auth_timestamp', new Date().toISOString());
        
        setIsLoggingIn(false);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid staff credentials. Double check the username or password.');
        setIsLoggingIn(false);
      }
    }, 800);
  };

  return (
    <div className="bg-[#0A192F] min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-300">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 px-4">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 border border-blue-500/10 text-blue-400 rounded-2xl">
          <Lock className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">Staff Administration Portal</h2>
          <p className="mt-1 text-xs text-blue-400 uppercase tracking-widest font-mono">
            Secure, restricted entry for Apex Recruitment managers
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#112240] border border-slate-800 rounded-2xl shadow-2xl px-6 py-8 sm:px-10 space-y-6">
          
          {error && (
            <div className="p-3.5 bg-red-950/20 border border-red-500/20 text-red-200 text-xs font-semibold rounded-lg flex items-start space-x-2.5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="admin_username" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                Staff Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="admin_username"
                  type="text"
                  required
                  className="block w-full text-white bg-[#0A192F] border border-slate-805 pl-10 pr-4 py-3 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-505 focus:border-blue-505 placeholder-slate-500"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin_password" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                Portal Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="admin_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full text-white bg-[#0A192F] border border-slate-805 pl-10 pr-10 py-3 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-505 focus:border-blue-505 placeholder-slate-500"
                  placeholder="Enter secret credentials"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                id="sign_in_btn"
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest py-4 px-4 rounded-lg font-mono transition-all duration-200 cursor-pointer shadow-md shadow-blue-500/10 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authorizing Staff Session...</span>
                  </span>
                ) : (
                  <span>Access Secure Dashboard</span>
                )}
               </button>
            </div>
          </form>

          {/* Secure mode indicator */}
          <div className="border-t border-slate-800 pt-5 mt-4 flex justify-between items-center text-[10px] text-slate-505 font-mono">
            <span className="flex items-center font-bold text-slate-400 uppercase tracking-widest"><ShieldCheck className="h-3.5 w-3.5 text-blue-400 mr-1" /> SSL Protected</span>
            <span className="flex items-center font-bold text-slate-400 uppercase tracking-widest"><Database className="h-3.5 w-3.5 text-blue-400 mr-1" /> {dbMode === 'supabase' ? 'Supabase Live Connection' : 'Offline Emulator'}</span>
          </div>

        </div>

        {/* Informational test credentials for the preview */}
        <div className="mt-6 bg-[#112240] border border-slate-800 rounded-xl p-5 text-center">
          <p className="font-black text-blue-400 uppercase tracking-widest text-[10px] mb-2 font-mono">Developer Credentials Helper</p>
          <p className="text-slate-400 text-xs font-semibold leading-relaxed">
            For rapid testing in the live preview iframe, configure variables in the secrets panel or enter default credentials:
          </p>
          <div className="mt-4 font-mono text-blue-300 bg-[#0A192F] p-3 rounded text-[10px] uppercase tracking-wider select-all inline-block border border-slate-805">
            Username: <span className="text-white font-bold select-all">admin</span> <br />
            Password: <span className="text-white font-bold select-all">admin-portal-2026</span>
          </div>
        </div>

      </div>
    </div>
  );
}
