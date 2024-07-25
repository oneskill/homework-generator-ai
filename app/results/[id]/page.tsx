'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Question {
  _id: string;
  type: 'mcq' | 'truefalse' | 'fillintheblank' | 'voice';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface Result {
  _id: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  duration: number;
  completedAt: string;
}

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const assessmentId = params.id as string;
  const token = searchParams.get('token');

  const [assessment, setAssessment] = useState<{ title: string, questions: Question[] } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [individualResult, setIndividualResult] = useState<Result | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentResponse, resultsResponse] = await Promise.all([
          axios.get(`/api/assessments/${assessmentId}`),
          axios.get(`/api/results/${assessmentId}`, { params: { token } })
        ]);

        setAssessment(assessmentResponse.data);
        if (token) {
          setIndividualResult(resultsResponse.data);
        } else {
          setResults(resultsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchData();
  }, [assessmentId, token]);

  if (!assessment) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{assessment.title} - Results</h1>
      
      {individualResult ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Individual Result</h2>
          <p>Student: {individualResult.studentName}</p>
          <p>Score: {individualResult.score} / {individualResult.totalQuestions}</p>
          <p>Duration: {Math.floor(individualResult.duration / 60)}:{(individualResult.duration % 60).toString().padStart(2, '0')}</p>
          <p>Completed: {new Date(individualResult.completedAt).toLocaleString()}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Overall Results</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Student</th>
                <th className="border p-2">Score</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Completed</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td className="border p-2">{result.studentName}</td>
                  <td className="border p-2">{result.score} / {result.totalQuestions}</td>
                  <td className="border p-2">
                    {Math.floor(result.duration / 60)}:{(result.duration % 60).toString().padStart(2, '0')}
                  </td>
                  <td className="border p-2">{new Date(result.completedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}