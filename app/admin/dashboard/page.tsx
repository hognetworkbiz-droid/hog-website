'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Voucher {
  id: string;
  voucher_code: string;
  data_amount: string;
  price: number;
  status: string;
  balance?: number;
}

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingBalance, setCheckingBalance] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [router]);

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
        const data = await vouchersRes.json();
        setVouchers(data);
      }
      if (transactionsRes.ok) {
        const data = await transactionsRes.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkVoucherBalance = async (voucherCode: string, index: number) => {
    setCheckingBalance(voucherCode);
    try {
      const res = await fetch('/api/omada/vouchers/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode }),
      });

      if (res.ok) {
        const data = await res.json();
        setVouchers((prev) =>
          prev.map((v, i) =>
            i === index ? { ...v, balance: data.balance } : v
          )
        );
      }
    } catch (error) {
      console.error('Failed to check balance:', error);
    } finally {
      setCheckingBalance(null);
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
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="pb-3 px-2">Voucher Code</th>
                    <th className="pb-3 px-2">Data Amount</th>
                    <th className="pb-3 px-2">Price</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Balance</th>
                    <th className="pb-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v, idx) => (
                    <tr key={v.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono text-xs">
                        {v.voucher_code}
                      </td>
                      <td className="py-3 px-2">{v.data_amount}</td>
                      <td className="py-3 px-2">₦{v.price}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            v.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {v.balance ? (
                          <span className="text-blue-600 font-bold">
                            {v.balance} GB
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => checkVoucherBalance(v.voucher_code, idx)}
                          disabled={checkingBalance === v.voucher_code}
                          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs"
                        >
                          {checkingBalance === v.voucher_code
                            ? 'Checking...'
                            : 'Check Balance'}
                        </button>
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
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="pb-3 px-2">Reference</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono text-xs">
                        {t.reference}
                      </td>
                      <td className="py-3 px-2">₦{t.amount}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            t.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
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
