import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import { generateQuestions } from '@/lib/questionGenerator';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  console.log('Generating questions for assessment:', params.id);

  try {
    const assessment = await Assessment.findById(params.id);
    if (!assessment) {
      console.log('Assessment not found');
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const { maxQuestions = 10 } = await request.json();
    console.log('Generating', maxQuestions, 'questions for topic:', assessment.topic);

    const generatedQuestions = await generateQuestions(assessment.topic, maxQuestions);
    console.log('Generated questions:', generatedQuestions);

    assessment.questions = generatedQuestions.map(q => ({
      type: 'mcq',
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

    await assessment.save();
    console.log('Saved generated questions to assessment');

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Error generating questions' }, { status: 500 });
  }
}