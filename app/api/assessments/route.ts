import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Assessment from '../../../lib/models/Assessment';
import { generateQuestions } from '../../../lib/questionGenerator';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { topic, numberOfQuestions } = body;

    console.log('Generating questions with AI for topic:', topic);
    const questions = await generateQuestions(topic, numberOfQuestions);
    console.log('Generated questions:', questions);

    const assessment = new Assessment({
      ...body,
      questions: questions.map(q => ({
        type: 'mcq',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      })),
    });

    await assessment.save();
    console.log('Created assessment:', assessment);

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ error: 'Error creating assessment' }, { status: 500 });
  }
}

export async function GET() {
    await dbConnect();
    try {    
      const assessments = await Assessment.find({}, '_id title createdAt').sort({ createdAt: -1 });
      return NextResponse.json(assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return NextResponse.json({ error: 'Error fetching assessments' }, { status: 500 });
    }
  }