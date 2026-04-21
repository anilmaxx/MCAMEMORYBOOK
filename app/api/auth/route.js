import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    // In MVP, hardcoded password
    const validPassword = process.env.CLASS_PASSWORD || 'mca2024';

    if (password === validPassword) {
      return NextResponse.json({ success: true, token: 'mca-auth-token-123' }, { status: 200 });
    }
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
