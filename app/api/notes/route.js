import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM memory_notes ORDER BY created_at DESC');
    return NextResponse.json({ success: true, notes: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { author_name, message } = await request.json();
    if (!author_name || !message) {
      return NextResponse.json({ success: false, message: 'Name and message required' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'INSERT INTO memory_notes (author_name, message) VALUES (?, ?)',
      args: [author_name, message]
    });

    return NextResponse.json({ success: true, noteId: Number(result.lastInsertRowid) });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
