'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Question {
  _id: string;
  question: string;
  correctAnswer: string;
}

interface Answer {
  question: string;
  userAnswer: string;
  correct: boolean;
  explanation?: string;
}

interface ReviewData {
  assessment: {
    title: string;
    questions: Question[];
  };
  result: {
    score: number;
    answers: Answer[];
  };
}

export default function ReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const token = searchParams.get('token');
        const response = await axios.get(`/api/assessments/${params.id}/review?token=${token}`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching review data:', error);
        setError('Failed to load review data');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [params.id, searchParams]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!reviewData) return <div>No data available</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{reviewData.assessment.title} - Review</h1>
      <p className="mb-4">Your score: {reviewData.result.score} out of {reviewData.assessment.questions.length}</p>
      {reviewData.result.answers.map((answer, index) => {
        const question = reviewData.assessment.questions[index];
        return (
          <div key={question._id} className="mb-6 p-4 border rounded">
            <p className="font-semibold">{question.question}</p>
            <p>Your answer: {answer.userAnswer}</p>
            <p>Correct answer: {question.correctAnswer}</p>
            <p className={answer.correct ? "text-green-600" : "text-red-600"}>
              {answer.correct ? "Correct" : "Incorrect"}
            </p>
            {!answer.correct && answer.explanation && (
              <div className="mt-2">
                <p className="font-semibold">Explanation:</p>
                <p>{answer.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}