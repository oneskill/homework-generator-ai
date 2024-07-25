import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';

interface StatCardProps {
  icon: IconName;
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`text-4xl text-${color}-500 mr-4`}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <div>
      <p className="text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;