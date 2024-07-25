import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import Result from '@/lib/models/Result';
import StudentLink from '@/lib/models/StudentLink';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { assessmentId, userAnswers, duration, token } = body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    if (token) {
      const studentLink = await StudentLink.findOne({ assessment: assessmentId, token, usedAt: null });
      if (!studentLink) {
        return NextResponse.json({ error: 'Invalid or used token' }, { status: 403 });
      }
      studentLink.usedAt = new Date();
      await studentLink.save();
    }

    const score = assessment.questions.reduce((acc, question) => {
      return acc + (userAnswers[question._id] === question.correctAnswer ? 1 : 0);
    }, 0);

    const result = new Result({
      assessment: assessmentId,
      userAnswers,
      score,
      duration,
    });

    await result.save();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error submitting results' }, { status: 500 });
  }
}