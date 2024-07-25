import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import Result from '@/lib/models/Result';

export async function GET() {
  await dbConnect();

  try {
    const totalAssessments = await Assessment.countDocuments();
    const totalStudents = await Result.distinct('studentName').countDocuments();
    const averageScoreResult = await Result.aggregate([
      { $group: { _id: null, averageScore: { $avg: '$score' } } }
    ]);
    const averageScore = averageScoreResult[0]?.averageScore || 0;

    return NextResponse.json({
      totalAssessments,
      totalStudents,
      averageScore
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}