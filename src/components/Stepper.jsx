import React from 'react';
import { useLocation } from 'react-router-dom';

const Stepper = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const steps = [
    { number: 1, label: 'Select Policy', path: '/' },
    { number: 2, label: 'Customer Details', path: '/customer-details' },
    { number: 3, label: 'Payment', path: '/payment' },
    { number: 4, label: 'Confirmation', path: '/confirmation' }
  ];
  
  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.path === currentPath);
  
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          // Determine if the step is active, completed, or upcoming
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full 
                    ${isActive ? 'bg-blue-600 text-white' : ''}
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                    transition-all duration-300
                  `}
                >
                  {step.number}
                </div>
                <span className={`mt-2 text-sm ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector Line (except after the last step) */}
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-2 
                    ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                    transition-all duration-300
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;