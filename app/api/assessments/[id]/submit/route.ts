import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import Result from '@/lib/models/Result';
import StudentLink from '@/lib/models/StudentLink';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { answers, token } = await request.json();
    console.log('Received submission:', { answers, token });

    const assessment = await Assessment.findById(params.id);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    let studentName = 'Anonymous';
    if (token) {
      const studentLink = await StudentLink.findOne({ assessment: params.id, token });
      if (studentLink) {
        studentName = studentLink.studentName;
        studentLink.usedAt = new Date();
        await studentLink.save();
      }
    }

    console.log('Student name:', studentName);

    const score = assessment.questions.reduce((acc, question, index) => {
      return acc + (question.correctAnswer.toLowerCase() === answers[index].toLowerCase() ? 1 : 0);
    }, 0);

    const result = new Result({
      assessment: assessment._id,
      studentName,
      score,
      answers: assessment.questions.map((question, index) => ({
        question: question._id,
        userAnswer: answers[index],
        correct: question.correctAnswer.toLowerCase() === answers[index].toLowerCase()
      }))
    });

    await result.save();
    console.log('Saved result:', result.toObject());

    return NextResponse.json({ 
      score, 
      totalQuestions: assessment.questions.length, 
      studentName,
      resultId: result._id 
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json({ error: 'Error submitting assessment' }, { status: 500 });
  }
}