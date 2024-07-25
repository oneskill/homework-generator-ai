'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import VoiceRecorder from './VoiceRecorder';

interface Question {
  _id: string;
  type: 'mcq' | 'truefalse' | 'fillintheblank' | 'voice';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface Assessment {
  _id: string;
  title: string;
  duration: number;
  questions: Question[];
}

interface AssessmentViewProps {
  assessmentId: string;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ assessmentId }) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axios.get(`/api/assessments/${assessmentId}`, {
          params: { token },
        });
        setAssessment(response.data);
        setTimeRemaining(response.data.duration * 60);
      } catch (error) {
        console.error('Error fetching assessment:', error);
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error);
        } else {
          setError('An error occurred while fetching the assessment.');
        }
      }
    };

    fetchAssessment();
  }, [assessmentId, token]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (assessment) {
      setQuizCompleted(true);
    }
  }, [timeRemaining, assessment]);

  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
    
    setTimeout(() => {
      if (currentQuestionIndex < assessment!.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const handleVoiceRecording = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    formData.append('questionId', assessment!.questions[currentQuestionIndex]._id);

    try {
      const response = await axios.post(`/api/voice-evaluation`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const { score } = response.data;
      handleAnswer(assessment!.questions[currentQuestionIndex]._id, score.toString());
    } catch (error) {
      console.error('Error evaluating voice recording:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/assessments/${assessmentId}/submit`, {
        answers: Object.values(userAnswers),
        token,
      });
      console.log('Submission response:', response.data);
      router.push(`/assessment/${assessmentId}/review?token=${token}&resultId=${response.data.resultId}`);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setError('Failed to submit assessment. Please try again.');
    }
  };

  if (!assessment) return <div>Loading...</div>;

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quiz Completed</h1>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button 
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!studentName.trim()}
        >
          Submit Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
      <div className="mb-4">Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
      <div className="mb-4">
        Question {currentQuestionIndex + 1} of {assessment.questions.length}
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl mb-4">{currentQuestion.question}</h2>
        {currentQuestion.type === 'mcq' && (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion._id, option)}
                className="w-full text-left p-2 border rounded hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {currentQuestion.type === 'truefalse' && (
          <div className="space-x-4">
            <button
              onClick={() => handleAnswer(currentQuestion._id, 'True')}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              True
            </button>
            <button
              onClick={() => handleAnswer(currentQuestion._id, 'False')}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              False
            </button>
          </div>
        )}
        {currentQuestion.type === 'fillintheblank' && (
          <input
            type="text"
            onChange={(e) => handleAnswer(currentQuestion._id, e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Type your answer here"
          />
        )}
        {currentQuestion.type === 'voice' && (
          <div>
            <p>Please record yourself saying: "{currentQuestion.question}"</p>
            <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentView;