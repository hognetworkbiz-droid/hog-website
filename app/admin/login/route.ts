import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Simple password verification (use bcrypt in production)
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (passwordHash !== data.password_hash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: data.id, username: data.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
