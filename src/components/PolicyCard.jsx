import React from 'react';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePolicy } from '../context/PolicyContext';

// Destructure new props: originalPrice and isMostPopular
const PolicyCard = ({ id, type, price, originalPrice, features, duration, isMostPopular }) => {
  const navigate = useNavigate();
  const { selectPolicy } = usePolicy();
  
  const handleSelectPlan = () => {
    // Pass all relevant policy details to selectPolicy, including id and originalPrice if needed
    selectPolicy(id, type, price, duration, originalPrice); // Assuming selectPolicy can take these
    navigate('/customer-details');
  };
  
  return (
    <div className={`
      bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-lg hover:-translate-y-1
      ${isMostPopular ? 'border-2 border-green-500' : ''} {/* Green border for Most Popular */}
    `}>
      <div className="bg-blue-600 text-white p-4 font-bold text-xl relative">
        {type}
        {isMostPopular && (
          <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Most Popular
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">₹{price}</span>
          {originalPrice && price < originalPrice && (
            <span className="ml-2 text-base text-gray-500 line-through">₹{originalPrice}</span>
          )}
        </div>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mb-4 inline-block">
          {duration}
        </span>
        
        <ul className="mb-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
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
