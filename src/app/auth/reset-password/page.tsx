// src/app/reset-password/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No reset token found. The link may be invalid.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Missing token.');
      return;
    }
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess('Password has been reset successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 rounded-lg shadow-xl bg-white w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-gray-600">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold" disabled={!token || !!success}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    );
  }