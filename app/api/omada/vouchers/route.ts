import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, accessToken, voucherId } = await req.json();

    const response = await fetch(
      `${process.env.OMADA_API_ENDPOINT}/openapi/v1/vouchers/${action}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voucherId }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process voucher request' },
      { status: 500 }
    );
  }
}
