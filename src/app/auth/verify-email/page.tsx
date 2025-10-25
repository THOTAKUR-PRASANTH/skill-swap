// src/app/verify-email/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

// We need to wrap the component in Suspense because useSearchParams() is a Client Component hook
// that needs to be used within a suspense boundary during server rendering.
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const res = await fetch('/api/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          const data = await res.json();
          if (res.ok) {
            setStatus('success');
            setMessage('Email successfully verified! You can now log in.');
          } else {
            setStatus('error');
            setMessage(data.error || 'Verification failed. The link may be invalid or expired.');
          }
        } catch (err) {
          setStatus('error');
          setMessage('An unexpected error occurred.');
        }
      };
      verifyToken();
    } else {
      setStatus('error');
      setMessage('No verification token found.');
    }
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 rounded-lg shadow-xl bg-white w-96 text-center">
        {status === 'verifying' && <p className="text-gray-600">{message}</p>}
        {status === 'success' && (
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-800 mb-6">{message}</p>
            <Link href="/login" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Go to Login
            </Link>
          </div>
        )}
        {status === 'error' && (
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-800">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}