import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Library } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded login for demonstration
    // In a real app, this would check against a backend or encrypted storage
    if (username === 'admin' && password === 'admin123') {
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-brand-red p-8 text-white text-center">
          <div className="inline-flex p-4 bg-white/20 rounded-2xl mb-4">
            <Library className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-serif font-bold">University Library</h1>
          <p className="text-white/70 text-sm mt-1">Please login to manage records</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all bg-gray-50"
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand-red text-white rounded-xl font-bold shadow-lg shadow-brand-red/20 hover:bg-brand-red/90 transition-all active:scale-[0.98]"
          >
            Login to Dashboard
          </button>
          
          <p className="text-center text-xs text-gray-400">
            Default: admin / admin123
          </p>
        </form>
      </motion.div>
    </div>
  );
}
