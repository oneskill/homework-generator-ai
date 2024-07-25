import { useState } from 'react';
import axios from 'axios';

interface Assessment {
  _id: string;
  title: string;
}

const AssessmentGenerator = ({ assessment }: { assessment: Assessment }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`/api/assessments/${assessment._id}/generate`);
      setGeneratedQuestions(response.data.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Generate Questions for: {assessment.title}</h2>
      <button
        onClick={generateQuestions}
        disabled={isGenerating}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {isGenerating ? 'Generating...' : 'Generate Questions'}
      </button>
      {generatedQuestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Questions:</h3>
          {}
        </div>
      )}
    </div>
  );
};