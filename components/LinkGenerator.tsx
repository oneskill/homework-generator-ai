import React, { useState } from 'react';
import axios from 'axios';

interface LinkGeneratorProps {
  assessmentId: string;
  onGenerate?: () => void;
}

const LinkGenerator: React.FC<LinkGeneratorProps> = ({ assessmentId, onGenerate }) => {
  const [studentName, setStudentName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLink = async () => {
    if (!studentName.trim()) {
      setError('Please enter a student name');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-link', {
        assessmentId,
        studentName,
      });
      setGeneratedLink(response.data.link);
    } catch (error) {
      console.error('Error generating link:', error);
      setError('Failed to generate link. Please try again.');
    } finally {
      setIsGenerating(false);
      if (onGenerate) {
        onGenerate();
      }
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Generate Student Link</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name"
          className="flex-grow px-2 py-1 border rounded"
        />
        <button
          onClick={generateLink}
          disabled={isGenerating}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isGenerating ? 'Generating...' : 'Generate Link'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {generatedLink && (
        <div className="mt-4">
          <p className="font-semibold">Generated Link:</p>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
            {generatedLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default LinkGenerator;