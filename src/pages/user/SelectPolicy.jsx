import React from 'react';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import PolicyCard from '../../components/PolicyCard';

const SelectPolicy = () => {
  const policies = [
    {
      id: "Kalyan_001",
      type: 'Standard Coverage',
      price: 0,
      duration: "1 Year",
      features: [
        { name: '24/7 Roadside Assistance', included: true },
        { name: 'Nation Wide Towing', included: true },
        { name: 'Flat Tire Assistance', included: true },
        { name: 'Fuel Delivery', included: true },
        { name: 'Battery Jump Start', included: true },
      ]
    },
    {
      id: "Kalyan_002",
      type: 'Premium Coverage',
      price: 4499,
      duration: "2 Year",
      features: [
        { name: '24/7 Roadside Assistance', included: true },
        { name: 'Nation Wide Towing', included: true },
        { name: 'Flat Tire Assistance', included: true },
        { name: 'Fuel Delivery', included: true },
        { name: 'Battery Jump Start', included: true },
      ]
    },
    {
      id: "Kalyan_003",
      type: 'Platinum Coverage',
      price: 6499,
      duration: "3 Year",
      features: [
        { name: '24/7 Roadside Assistance', included: true },
        { name: 'Nation Wide Towing', included: true },
        { name: 'Flat Tire Assistance', included: true },
        { name: 'Fuel Delivery', included: true },
        { name: 'Battery Jump Start', included: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Select Your RSA Policy
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {policies.map((policy, index) => (
            <PolicyCard
              key={index}
              type={policy.type}
              price={policy.price}
              features={policy.features}
              duration={policy.duration}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SelectPolicy;
