// src/app/components/MfaSetup.tsx
'use client';

import { useState } from 'react';

export default function MfaSetup() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    const res = await fetch('/api/mfa/generate', { method: 'POST' });
    if (res.ok) {
      const { qrCodeDataUrl, secret } = await res.json();
      setQrCode(qrCodeDataUrl);
      setSecret(secret);
    }
    setIsLoading(false);
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    const res = await fetch('/api/mfa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      setIsMfaEnabled(true);
      setQrCode(''); // Clear the QR code on success
      alert('MFA Enabled Successfully!');
    } else {
      const { error } = await res.json();
      setError(error || 'Verification failed.');
    }
    setIsLoading(false);
  };

  if (isMfaEnabled) {
    return <p className="text-green-600 font-bold">Multi-Factor Authentication is enabled on your account.</p>;
  }

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Set Up Multi-Factor Authentication</h3>
      {!qrCode ? (
        <button onClick={handleGenerate} disabled={isLoading} className="bg-blue-600 text-white p-2 rounded">
          {isLoading ? 'Generating...' : 'Enable 2FA'}
        </button>
      ) : (
        <div>
          <p>1. Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
          <img src={qrCode} alt="QR Code" className="my-4" />
          <p>Or manually enter this secret: <code className="bg-gray-200 p-1 rounded">{secret}</code></p>
          <hr className="my-4" />
          <p>2. Enter the 6-digit code from your app below to verify.</p>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            maxLength={6}
            className="border p-2 rounded w-40 my-2"
          />
          <button onClick={handleVerify} disabled={isLoading} className="bg-green-600 text-white p-2 rounded ml-2">
            {isLoading ? 'Verifying...' : 'Verify & Enable'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}