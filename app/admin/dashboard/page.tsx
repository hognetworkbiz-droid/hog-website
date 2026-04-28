'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [vouchers, setVouchers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const vouchersRes = await fetch('/api/admin/vouchers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transactionsRes = await fetch('/api/admin/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (vouchersRes.ok) {
        setVouchers(await vouchersRes.json());
      }
      if (transactionsRes.ok) {
        setTransactions(await transactionsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Total Vouchers</p>
            <p className="text-3xl font-bold text-blue-600">
              {vouchers.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Total Transactions</p>
            <p className="text-3xl font-bold text-green-600">
              {transactions.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600">
              ₦
              {transactions
                .reduce((sum, t) => sum + (t.amount || 0), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Vouchers Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Vouchers</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="pb-2">Voucher Code</th>
                    <th className="pb-2">Data Amount</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v: any) => (
                    <tr key={v.id} className="border-b">
                      <td className="py-2 font-mono">{v.voucher_code}</td>
                      <td>{v.data_amount}</td>
                      <td>₦{v.price}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded text-sm font-bold ${
                            v.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Transactions</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="pb-2">Reference</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t: any) => (
                    <tr key={t.id} className="border-b">
                      <td className="py-2 font-mono">{t.reference}</td>
                      <td>₦{t.amount}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded text-sm font-bold ${
                            t.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td>{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
