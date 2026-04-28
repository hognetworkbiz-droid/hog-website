import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    // Get OAuth 2.0 token from Omada controller
    const tokenResponse = await fetch(
      `${process.env.OMADA_API_ENDPOINT}/openapi/v1/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: process.env.OMADA_CLIENT_ID!,
          client_secret: process.env.OMADA_CLIENT_SECRET!,
          username,
          password,
        }),
      }
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    const tokenData = await tokenResponse.json();
    return NextResponse.json(tokenData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
