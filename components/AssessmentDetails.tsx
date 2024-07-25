import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LinkGenerator from '@/components/LinkGenerator';

interface Question {
  _id: string;
  question: string;
  correctAnswer: string;
}

interface Result {
  _id: string;
  studentName: string;
  score: number;
  completedAt: string;
}

interface StudentLink {
  _id: string;
  studentName: string;
  token: string;
  createdAt: string;
  usedAt: string | null;
}

interface AssessmentDetailsProps {
  assessmentId: string;
  onUpdate: () => void;
}

export default function AssessmentDetails({ assessmentId, onUpdate }: AssessmentDetailsProps) {
  const [assessment, setAssessment] = useState<any>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [studentLinks, setStudentLinks] = useState<StudentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAssessmentDetails();
    fetchResults();
    fetchStudentLinks();
  }, [assessmentId]);

  const fetchAssessmentDetails = async () => {
    try {
      const response = await axios.get(`/api/assessments/${assessmentId}`);
      setAssessment(response.data);
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      setError('Failed to load assessment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(`/api/assessments/${assessmentId}/results`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load results');
    }
  };

  const fetchStudentLinks = async () => {
    try {
      const response = await axios.get(`/api/assessments/${assessmentId}/student-links`);
      setStudentLinks(response.data);
    } catch (error) {
      console.error('Error fetching student links:', error);
      setError('Failed to load student links');
    }
  };

  const handleUpdateQuestion = async (questionId: string, updatedQuestion: Partial<Question>) => {
    try {
      await axios.put(`/api/assessments/${assessmentId}/questions/${questionId}`, updatedQuestion);
      fetchAssessmentDetails();
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await axios.delete(`/api/assessments/${assessmentId}/questions/${questionId}`);
      fetchAssessmentDetails();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!assessment) return <div className="flex items-center justify-center h-screen">Assessment not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-indigo-600">{assessment.title}</h2>
          
          <div className="mb-6">
            <nav className="flex space-x-4">
              {['Overview', 'Questions', 'Student Links', 'Results'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-600 hover:bg-indigo-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-indigo-600">Assessment Details</h3>
                <p><strong>Duration:</strong> {assessment.duration} minutes</p>
                <p><strong>Difficulty:</strong> {assessment.difficulty}</p>
                <p><strong>Language:</strong> {assessment.language}</p>
                <p><strong>Topic:</strong> {assessment.topic}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-indigo-600">Statistics</h3>
                <p><strong>Total Questions:</strong> {assessment.questions.length}</p>
                <p><strong>Average Score:</strong> {results.length > 0 ? (results.reduce((acc, r) => acc + r.score, 0) / results.length).toFixed(2) : 'N/A'}%</p>
                <p><strong>Total Completions:</strong> {results.length}</p>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              {assessment.questions.map((question: Question, index: number) => (
                <div key={question._id} className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold text-lg mb-2">Question {index + 1}: {question.question}</p>
                  <p className="mb-4"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingQuestion(question._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                  {editingQuestion === question._id && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      handleUpdateQuestion(question._id, {
                        question: formData.get('question') as string,
                        correctAnswer: formData.get('correctAnswer') as string,
                      });
                    }} className="mt-4 space-y-2">
                      <input name="question" defaultValue={question.question} className="w-full p-2 border rounded" />
                      <input name="correctAnswer" defaultValue={question.correctAnswer} className="w-full p-2 border rounded" />
                      <div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition mr-2">Save</button>
                        <button onClick={() => setEditingQuestion(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'student links' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-600">Generate Student Links</h3>
                <LinkGenerator assessmentId={assessmentId} onGenerate={fetchStudentLinks} />
              </div>
              {studentLinks.length > 0 ? (
                <div className="overflow-x-auto bg-gray-50 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Student Name</th>
                        <th className="p-3 text-left">Link</th>
                        <th className="p-3 text-left">Created At</th>
                        <th className="p-3 text-left">Used At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentLinks.map(link => (
                        <tr key={link._id} className="hover:bg-gray-100">
                          <td className="p-3">{link.studentName}</td>
                          <td className="p-3">
                            <a
                              href={`/assessment/${assessmentId}?token=${link.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Open Link
                            </a>
                          </td>
                          <td className="p-3">{new Date(link.createdAt).toLocaleString()}</td>
                          <td className="p-3">{link.usedAt ? new Date(link.usedAt).toLocaleString() : 'Not used'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No student links generated yet.</p>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              {results.length > 0 ? (
                <div className="overflow-x-auto bg-gray-50 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Student</th>
                        <th className="p-3 text-left">Score</th>
                        <th className="p-3 text-left">Completed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(result => (
                        <tr key={result._id} className="hover:bg-gray-100">
                          <td className="p-3">{result.studentName}</td>
                          <td className="p-3">{result.score}</td>
                          <td className="p-3">{new Date(result.completedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No results yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}