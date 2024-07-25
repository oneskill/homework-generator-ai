import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import Result from '@/lib/models/Result';
import StudentLink from '@/lib/models/StudentLink';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const resultId = searchParams.get('resultId');
    console.log('Received token:', token, 'resultId:', resultId);

    const assessment = await Assessment.findById(params.id);
    if (!assessment) {
      console.log('Assessment not found');
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    let result;
    if (resultId) {
      result = await Result.findById(resultId);
    } else if (token) {
      const studentLink = await StudentLink.findOne({ assessment: params.id, token });
      console.log('Found student link:', studentLink);
      if (studentLink) {
        result = await Result.findOne({ assessment: params.id, studentName: studentLink.studentName }).sort({ createdAt: -1 });
      }
    }

    console.log('Found result:', result);

    if (!result) {
      console.log('Result not found');
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const reviewData = {
      assessment: {
        title: assessment.title,
        questions: assessment.questions,
      },
      result: {
        score: result.score,
        answers: result.answers,
      },
    };

    console.log('Sending review data:', reviewData);
    return NextResponse.json(reviewData);
  } catch (error) {
    console.error('Error fetching review data:', error);
    return NextResponse.json({ error: 'Error fetching review data' }, { status: 500 });
  }
}