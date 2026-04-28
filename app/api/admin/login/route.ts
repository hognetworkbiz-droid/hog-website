import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Get admin user from database
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

    // Verify password (you should use bcrypt in production)
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

    // Create session
    return NextResponse.json({
      id: data.id,
      username: data.username,
      email: data.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
