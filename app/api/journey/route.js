import { NextResponse } from 'next/server';
import db from '@/lib/db';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM group_photos ORDER BY created_at ASC');
    return NextResponse.json({ success: true, photos: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const photoFile = formData.get('photo');
    const caption = formData.get('caption');

    if (!photoFile || typeof photoFile === 'string') {
      return NextResponse.json({ success: false, message: 'Photo required' }, { status: 400 });
    }

    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${photoFile.type};base64,${base64Data}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'classroom_journey',
    });

    await db.execute({
      sql: 'INSERT INTO group_photos (url, caption) VALUES (?, ?)',
      args: [uploadResult.secure_url, caption || null]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
