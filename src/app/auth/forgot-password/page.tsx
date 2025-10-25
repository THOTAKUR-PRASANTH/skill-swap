// src/app/forgot-password/page.tsx
'use client';

import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('If an account with that email exists, a password reset link has been sent.');
      } else {
        const data = await res.json();
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 rounded-lg shadow-xl bg-white w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <p className="text-gray-600 mb-4 text-center">Enter your email and we ll send you a link to reset your password.</p>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}