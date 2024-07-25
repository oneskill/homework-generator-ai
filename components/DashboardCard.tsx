import React from 'react';
import { useRouter } from 'next/navigation';

interface DashboardCardProps {
  id: string;
  title: string;
  averageScore: string;
  completions: string;
  isLarge?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ id, title, averageScore, completions, isLarge = false }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/assessment/${id}/`);
  };

  const handleOpenAssessment = () => {
    router.push(`/assessment/${id}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isLarge ? 'md:col-span-2' : ''}`}>
      <h3 className="text-xl font-semibold mb-4 text-indigo-600">{title}</h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Average Score:</p>
          <p className="text-lg font-bold text-green-500">{averageScore}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completions:</p>
          <p className="text-lg font-bold text-blue-500">{completions}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <button 
          onClick={handleViewDetails}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          View Details
        </button>
        <button 
          onClick={handleOpenAssessment}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Open Assessment
        </button>
      </div>
    </div>
  );
};

export default DashboardCard;