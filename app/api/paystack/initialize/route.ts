import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const { email, amount, dataAmount } = await req.json();

    // Initialize payment on Paystack (Secret key stays on server)
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata: {
          dataAmount,
        },
      }),
    });

    const data = await response.json();

    // Save pending transaction to database
    if (data.status) {
      await supabaseServer.from('transactions').insert({
        reference: data.data.reference,
        amount: amount / 100,
        status: 'pending',
        email,
      });
    }

    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
