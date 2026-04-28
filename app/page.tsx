'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      {/* Navigation */}
      <nav className="bg-black bg-opacity-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">WiFi Data Vouchers</h1>
          <Link href="/admin/login" className="text-white hover:text-blue-300">
            Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center text-white mb-12">
          <h2 className="text-5xl font-bold mb-4">Buy WiFi Data Vouchers</h2>
          <p className="text-xl text-gray-200">
            Fast, secure, and instant activation
          </p>
        </div>

        {/* Voucher Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <VoucherCard
            dataAmount="1GB"
            price="500"
            description="Perfect for browsing"
          />
          <VoucherCard
            dataAmount="5GB"
            price="2000"
            description="Best for streaming"
          />
          <VoucherCard
            dataAmount="10GB"
            price="3500"
            description="Unlimited streaming"
          />
        </div>

        {/* How It Works */}
        <div className="bg-white bg-opacity-10 backdrop-blur p-8 rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-6">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-blue-300 mb-2">1</div>
              <h4 className="text-lg font-bold mb-2">Select Plan</h4>
              <p>Choose your desired data package</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-300 mb-2">2</div>
              <h4 className="text-lg font-bold mb-2">Pay with Paystack</h4>
              <p>Secure payment processing</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-300 mb-2">3</div>
              <h4 className="text-lg font-bold mb-2">Get Voucher Code</h4>
              <p>Instant code delivery to email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoucherCard({
  dataAmount,
  price,
  description,
}: {
  dataAmount: string;
  price: string;
  description: string;
}) {
  return (
    <Link href={`/purchase?data=${dataAmount}&price=${price}`}>
      <div className="bg-white bg-opacity-10 backdrop-blur p-6 rounded-lg hover:bg-opacity-20 transition cursor-pointer border border-white border-opacity-20">
        <h3 className="text-3xl font-bold text-white mb-2">{dataAmount}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="text-2xl font-bold text-blue-300">₦{price}</div>
        <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-bold transition">
          Buy Now
        </button>
      </div>
    </Link>
  );
}
