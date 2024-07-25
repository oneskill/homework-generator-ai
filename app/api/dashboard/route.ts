import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/lib/models/Assessment';
import Result from '@/lib/models/Result';

export async function GET() {
  await dbConnect();

  try {
    const totalStudents = await Result.distinct('studentName').countDocuments();

    const averageScoreResult = await Result.aggregate([
      { $group: { _id: null, averageScore: { $avg: '$score' } } }
    ]);
    const averageScore = averageScoreResult[0]?.averageScore 
      ? averageScoreResult[0].averageScore.toFixed(2) + '%' 
      : 'N/A';

    const avgCompletionTimeResult = await Result.aggregate([
      { $group: { _id: null, avgCompletionTime: { $avg: '$completionTime' } } }
    ]);
    const avgCompletionTime = avgCompletionTimeResult[0]?.avgCompletionTime 
      ? avgCompletionTimeResult[0].avgCompletionTime.toFixed(0) + ' min' 
      : 'N/A';

    const assessments = await Assessment.aggregate([
      {
        $lookup: {
          from: 'results',
          localField: '_id',
          foreignField: 'assessment',
          as: 'results'
        }
      },
      {
        $project: {
          title: 1,
          averageScore: { $avg: '$results.score' },
          completions: { $size: '$results' }
        }
      }
    ]);

    const formattedAssessments = assessments.map(assessment => ({
      id: assessment._id.toString(),
      title: assessment.title,
      averageScore: assessment.averageScore ? assessment.averageScore.toFixed(2) + '%' : 'N/A',
      completions: assessment.completions
    }));

    return NextResponse.json({
      totalStudents,
      averageScore,
      avgCompletionTime,
      assessments: formattedAssessments
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}