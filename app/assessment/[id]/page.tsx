'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Question {
  _id: string;
  type: 'mcq' | 'truefalse' | 'fillblank';
  question: string;
  options?: string[];
  correctAnswer: string;
}

interface Assessment {
  _id: string;
  title: string;
  duration: number;
  difficulty: string;
  language: string;
  numberOfQuestions: number;
  vocabularyList: string;
  topic: string;
  questions: Question[];
}

export default function AssessmentPage() {
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; totalQuestions: number } | null>(null);

  useEffect(() => {
    fetchAssessment();
  }, [params.id]);

  const fetchAssessment = async () => {
    try {
      const response = await axios.get(`/api/assessments/${params.id}`);
      setAssessment(response.data);
      setUserAnswers(new Array(response.data.questions.length).fill(''));
    } catch (error) {
      console.error('Error fetching assessment:', error);
      setError('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < assessment!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFillBlankAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = event.target.value;
    setUserAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    try {
      const response = await axios.post(`/api/assessments/${assessment!._id}/submit`, {
        answers: userAnswers,
        user: 'anonymous'
      });
      setQuizResult(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
  </div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!assessment) return <div className="text-gray-500 text-center p-4">Assessment not found</div>;

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4 sm:p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-indigo-800">Quiz Completed</h1>
          {quizResult ? (
            <div className="text-center">
              <p className="text-2xl mb-4">Your score: <span className="font-bold text-indigo-600">{quizResult.score}</span> out of {quizResult.totalQuestions}</p>
              <p className="text-gray-600">Great job completing the assessment!</p>
            </div>
          ) : (
            <button onClick={submitQuiz} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-indigo-700 transition duration-300 ease-in-out shadow-md">
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4 sm:p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-indigo-800">{assessment.title}</h1>
          <p className="text-gray-600">This assessment has no questions.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4 sm:p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-indigo-800">{assessment.title}</h1>
          <p className="text-gray-600">No more questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-indigo-800">{assessment.title}</h1>
        <div className="mb-6">
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {assessment.questions.length}</p>
          <p className="text-xl mt-2">{currentQuestion.question}</p>
        </div>
        {currentQuestion.type === 'mcq' && (
          <div className="space-y-3">
            {currentQuestion.options!.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="block w-full text-left p-3 border border-indigo-200 rounded-md hover:bg-indigo-50 transition duration-300 ease-in-out"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {currentQuestion.type === 'truefalse' && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswer('True')}
              className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-md hover:from-green-500 hover:to-green-600 transition duration-300 ease-in-out shadow-md"
            >
              True
            </button>
            <button
              onClick={() => handleAnswer('False')}
              className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-md hover:from-red-500 hover:to-red-600 transition duration-300 ease-in-out shadow-md"
            >
              False
            </button>
          </div>
        )}
        {currentQuestion.type === 'fillblank' && (
          <div className="mt-4">
            <input
              type="text"
              value={userAnswers[currentQuestionIndex] || ''}
              onChange={handleFillBlankAnswer}
              className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type your answer here"
            />
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-indigo-700 transition duration-300 ease-in-out shadow-md"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}