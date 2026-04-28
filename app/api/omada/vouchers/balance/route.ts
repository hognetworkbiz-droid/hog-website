import { NextRequest, NextResponse } from 'next/server';

const OMADA_CLIENT_ID = process.env.OMADA_CLIENT_ID;
const OMADA_CLIENT_SECRET = process.env.OMADA_CLIENT_SECRET;
const OMADA_API_ENDPOINT = process.env.OMADA_API_ENDPOINT;

async function getOmadaToken() {
  try {
    const response = await fetch(
      `${OMADA_API_ENDPOINT}/openapi/v1/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: OMADA_CLIENT_ID!,
          client_secret: OMADA_CLIENT_SECRET!,
        }),
      }
    );

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Omada token error:', error);
    throw new Error('Failed to get Omada token');
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!OMADA_CLIENT_ID || !OMADA_CLIENT_SECRET || !OMADA_API_ENDPOINT) {
      throw new Error('Omada credentials not configured');
    }

    const { voucherCode } = await req.json();

    if (!voucherCode) {
      return NextResponse.json(
        { error: 'Voucher code is required' },
        { status: 400 }
      );
    }

    const token = await getOmadaToken();

    // GET request to check voucher balance
    const response = await fetch(
      `${OMADA_API_ENDPOINT}/openapi/v1/vouchers/${voucherCode}/balance`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Omada API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      voucherCode,
      balance: data.balance || 0,
      status: data.status || 'active',
    });
  } catch (error) {
    console.error('Check balance error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check voucher balance',
      },
      { status: 500 }
    );
  }
}
