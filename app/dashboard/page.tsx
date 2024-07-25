'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import AssessmentDetails from '@/components/AssessmentDetails';

interface Assessment {
  _id: string;
  title: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get('/api/assessments');
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    try {
      await axios.delete(`/api/assessments/${id}`);
      setAssessments(assessments.filter(assessment => assessment._id !== id));
      setSelectedAssessment(null);
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Assessments Dashboard
          </h1>
          <p className="text-purple-200 mt-2">
            Manage and view your assessments
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
              <ul className="space-y-4">
                {assessments.map(assessment => (
                  <li key={assessment._id} className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-200 p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-indigo-700">{assessment.title}</h2>
                    <p className="text-sm text-gray-600">Created at: {new Date(assessment.createdAt).toLocaleString()}</p>
                    <div className="flex flex-wrap mt-2 gap-2">
                      <button
                        onClick={() => setSelectedAssessment(assessment._id)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm rounded-md hover:from-purple-600 hover:to-indigo-700 transition duration-300 ease-in-out shadow-md"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment._id)}
                        className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 text-sm rounded-md hover:bg-red-600 transition duration-300 ease-in-out shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md ">
              {selectedAssessment && (
                <AssessmentDetails
                  assessmentId={selectedAssessment}
                  onUpdate={() => fetchAssessments()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}