import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';

export async function PUT(request: Request, { params }: { params: { id: string, questionId: string } }) {
  await dbConnect();

  try {
    const { question, correctAnswer } = await request.json();
    const assessment = await Assessment.findOneAndUpdate(
      { _id: params.id, 'questions._id': params.questionId },
      { $set: { 'questions.$.question': question, 'questions.$.correctAnswer': correctAnswer } },
      { new: true }
    );

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment or question not found' }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Error updating question' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string, questionId: string } }) {
  await dbConnect();

  try {
    const assessment = await Assessment.findByIdAndUpdate(
      params.id,
      { $pull: { questions: { _id: params.questionId } } },
      { new: true }
    );

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Error deleting question' }, { status: 500 });
  }
}