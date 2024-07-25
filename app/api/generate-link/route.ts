import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import StudentLink from '@/lib/models/StudentLink';
import crypto from 'crypto';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { assessmentId, studentName } = await request.json();

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const token = crypto.randomBytes(16).toString('hex');

    const studentLink = new StudentLink({
      assessment: assessmentId,
      studentName,
      token,
    });

    await studentLink.save();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const link = `${baseUrl}/assessment/${assessmentId}?token=${token}`;

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error('Error generating link:', error);
    return NextResponse.json({ error: 'Error generating link' }, { status: 500 });
  }
}