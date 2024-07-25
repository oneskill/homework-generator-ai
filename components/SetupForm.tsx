'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SetupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    duration: 5,
    difficulty: '',
    language: '',
    numberOfQuestions: 5,
    vocabularyList: '',
    topic: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = ['title', 'duration', 'difficulty', 'language', 'numberOfQuestions', 'topic'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill out the following required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/api/assessments', formData);
      console.log('Assessment created:', response.data);
      setSuccess('Assessment created successfully!');
      
      // Redirect to the assessment page after a short delay
      setTimeout(() => {
        router.push(`/assessment/${response.data._id}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating assessment:', error);
      setError('Failed to create assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-dashboard-bg rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-dashboard-heading text-center">Create New Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-dashboard-error bg-dashboard-error-bg p-2 rounded">{error}</div>}
        {success && <div className="text-dashboard-success bg-dashboard-success-bg p-2 rounded">{success}</div>}
        <div>
          <label htmlFor="title" className="block mb-2 text-dashboard-label font-semibold">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-dashboard-border rounded p-3 focus:outline-none focus:ring-2 focus:ring-dashboard-focus"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="block mb-2 text-dashboard-label font-semibold">Duration (minutes)*</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-dashboard-border rounded p-3 focus:outline-none focus:ring-2 focus:ring-dashboard-focus"
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block mb-2 text-dashboard-label font-semibold">Difficulty*</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full border border-dashboard-border rounded p-3 focus:outline-none focus:ring-2 focus:ring-dashboard-focus"
            required
          >
            <option value="">Select difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block mb-2 text-dashboard-label font-semibold">Language*</label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full border border-dashboard-border rounded p-3 focus:outline-none focus:ring-2 focus:ring-dashboard-focus"
            required
          />
        </div>
        <div>
          <label htmlFor="numberOfQuestions" className="block mb-2 text-dashboard-label font-semibold">Number of Questions*</label>
          <input
            type="number"
            id="numberOfQuestions"
            name="numberOfQuestions"
            value={formData.numberOfQuestions}
            onChange={handleChange}
            className="w-full border border-dashboard-border rounded p-3 focus:outline-none focus:ring-2 focus:ring-dashboard-focus"
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="vocabularyList" className="block mb-2 text-dashboard-label font-semibold">Vocabulary List</label>
          <textarea
            id="vocabularyList"
            name="vocabularyList"
            value={formData.vocabularyList}
            onChange={handleChange}
            className="w-full border border-dashboard-border rounded p-3 focus:outline-none focus:ring-2 focus:ring-dashboard-focus"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label htmlFor="topic" className="block mb-2 text-dashboard-label font-semibold">Topic*</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full border border-dashboard-border rounded p-3 focus:outline-none focus:ring-2 focus:ring-dashboard-focus"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-dashboard-button text-white px-4 py-3 rounded hover:bg-dashboard-button-hover focus:outline-none focus:ring-2 focus:ring-dashboard-focus disabled:bg-dashboard-button-disabled"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Assessment'}
        </button>
      </form>
    </div>
  );
};

export default SetupForm;