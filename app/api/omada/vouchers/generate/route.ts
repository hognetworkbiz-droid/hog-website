import { NextRequest, NextResponse } from 'next/server';

const OMADA_CLIENT_ID = process.env.OMADA_CLIENT_ID;
const OMADA_CLIENT_SECRET = process.env.OMADA_CLIENT_SECRET;
const OMADA_API_ENDPOINT = process.env.OMADA_API_ENDPOINT;

export async function POST(req: NextRequest) {import { NextRequest, NextResponse } from 'next/server';

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

    const { dataAmount } = await req.json();

    const token = await getOmadaToken();

    const response = await fetch(
      `${OMADA_API_ENDPOINT}/openapi/v1/vouchers/generate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataAmount,
          quantity: 1,
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Voucher generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voucher' },
      { status: 500 }
    );
  }
}
  try {
    const { dataAmount } = await req.json();

    // Step 1: Get OAuth token from Omada (using server-side secrets)
    const tokenResponse = await fetch(
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

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get Omada token');
    }

    // Step 2: Generate voucher using token
    const voucherResponse = await fetch(
      `${OMADA_API_ENDPOINT}/openapi/v1/vouchers/generate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataAmount,
          quantity: 1,
        }),
      }
    );

    const voucherData = await voucherResponse.json();
    return NextResponse.json(voucherData);
  } catch (error) {
    console.error('Voucher generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate voucher' },
      { status: 500 }
    );
  }
}
