import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StudentLink from '@/lib/models/StudentLink';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const studentLinks = await StudentLink.find({ assessment: params.id })
      .select('studentName token createdAt usedAt')
      .sort({ createdAt: -1 });

    return NextResponse.json(studentLinks);
  } catch (error) {
    console.error('Error fetching student links:', error);
    return NextResponse.json({ error: 'Error fetching student links' }, { status: 500 });
  }
}