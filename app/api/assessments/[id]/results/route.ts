import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Result from '@/lib/models/Result';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    console.log('Fetching results for assessment:', params.id);
    const results = await Result.find({ assessment: params.id })
      .select('studentName score completedAt')
      .sort({ completedAt: -1 });

    console.log('Fetched results:', results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Error fetching results' }, { status: 500 });
  }
}