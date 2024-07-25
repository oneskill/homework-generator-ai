import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import StudentLink from '@/lib/models/StudentLink';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const assessment = await Assessment.findById(params.id);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    if (token) {
      const studentLink = await StudentLink.findOne({ assessment: params.id, token });
      if (!studentLink) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }
      if (studentLink.usedAt) {
        return NextResponse.json({ error: 'This link has already been used' }, { status: 403 });
      }
    }

    return NextResponse.json(assessment);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching assessment' }, { status: 500 });
  }
}