import React from 'react';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePolicy } from '../context/PolicyContext';

const PolicyCard = ({ type, price, features, duration  }) => {
  const navigate = useNavigate();
  const { selectPolicy } = usePolicy();
  
  const handleSelectPlan = () => {
    selectPolicy(type, price, duration);
    navigate('/customer-details');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="bg-blue-600 text-white p-4 font-bold text-xl">
        {type}
      </div>
      
      <div className="p-6">
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold">₹{price}</span>
          <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {duration}
          </span>
        </div>
        
        <ul className="mb-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5\" size={18} />
              ) : (
                <X className="text-gray-400 mr-2 flex-shrink-0 mt-0.5" size={18} />
              )}
              <span className={feature.included ? 'text-gray-800' : 'text-gray-400'}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handleSelectPlan}
          className="w-full bg-blue-600 text-white py-3 rounded transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Select Plan
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;