import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { database } from '@/lib/firebase';
import { ref, update } from 'firebase/database';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { reference, customer, amount } = event.data;

      // Update Firebase with transaction
      await update(ref(database, `transactions/${reference}`), {
        status: 'completed',
        amount,
        customer_email: customer.email,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
