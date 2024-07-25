'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Result {
  _id: string;
  studentName: string;
  score: number;
  completedAt: string;
}

export default function AssessmentResultsPage() {
  const params = useParams();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [params.id]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`/api/assessments/${params.id}/results`);
      console.log('Received results:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Assessment Results</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Student</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Completed At</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result._id}>
              <td className="border p-2">{result.studentName}</td>
              <td className="border p-2">{result.score}</td>
              <td className="border p-2">{new Date(result.completedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}