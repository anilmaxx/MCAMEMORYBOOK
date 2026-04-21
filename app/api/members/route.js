import { NextResponse } from 'next/server';
import db from '@/lib/db';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM members ORDER BY roll_number ASC');
    return NextResponse.json({ success: true, members: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const roll_number = formData.get('roll_number');
    const name = formData.get('name');
    const signatureBase64 = formData.get('signature'); // base64 string
    const photoFile = formData.get('photo'); // File object

    if (!roll_number || !name) {
      return NextResponse.json({ success: false, message: 'Roll number and name required' }, { status: 400 });
    }

    let photoUrl = formData.get('existing_photo_url') || null;
    let signatureUrl = formData.get('existing_signature_url') || null;

    // Save photo to Cloudinary
    if (photoFile && photoFile.size > 0 && typeof photoFile !== 'string') {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${photoFile.type};base64,${base64Data}`;
      
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'classroom_profiles',
      });
      photoUrl = uploadResult.secure_url;
    }

    // Save signature to Cloudinary
    if (signatureBase64 && signatureBase64.startsWith('data:image')) {
      const uploadResult = await cloudinary.uploader.upload(signatureBase64, {
        folder: 'classroom_signatures',
      });
      signatureUrl = uploadResult.secure_url;
    }

    await db.execute({
      sql: `
        UPDATE members 
        SET name = ?, photo_url = COALESCE(?, photo_url), signature_url = COALESCE(?, signature_url)
        WHERE roll_number = ?
      `,
      args: [name, photoUrl, signatureUrl, roll_number]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
