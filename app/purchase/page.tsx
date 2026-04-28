'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PurchasePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dataAmount = searchParams.get('data') || '';
  const price = searchParams.get('price') || '';

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call your backend to initialize Paystack payment
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: parseInt(price) * 100, // Paystack uses kobo
          dataAmount,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to initialize payment');
      }

      const data = await res.json();

      // Redirect to Paystack
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Complete Purchase
          </h1>

          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="text-sm text-gray-600">Data Amount</p>
            <p className="text-2xl font-bold text-gray-800">{dataAmount}</p>
            <p className="text-sm text-gray-600 mt-2">Price</p>
            <p className="text-2xl font-bold text-blue-600">₦{price}</p>
          </div>

          <form onSubmit={handlePayment}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded transition"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
            Powered by Paystack
          </p>
        </div>
      </div>
    </div>
  );
}
