import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Result from '@/lib/models/Result';
import StudentLink from '@/lib/models/StudentLink';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (token) {
      const studentLink = await StudentLink.findOne({ assessment: params.id, token });
      if (!studentLink) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }

      const result = await Result.findOne({ assessment: params.id, studentLink: studentLink._id });
      if (!result) {
        return NextResponse.json({ error: 'Result not found' }, { status: 404 });
      }

      return NextResponse.json(result);
    } else {
      const results = await Result.find({ assessment: params.id }).sort({ completedAt: -1 });
      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Error fetching results' }, { status: 500 });
  }
}