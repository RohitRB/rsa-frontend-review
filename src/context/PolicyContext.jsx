import React, { createContext, useState, useEffect, useContext } from 'react';
import { format, addYears } from 'date-fns';

const PolicyContext = createContext();

// Custom hook
export const usePolicy = () => useContext(PolicyContext);

export const PolicyProvider = ({ children }) => {
  // Policies list (for admin & history)
  const [policies, setPolicies] = useState(() => {
    try {
      const stored = localStorage.getItem('policies');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error parsing policies from localStorage:', err);
      return [];
    }
  });
  
  // Current policy being created/purchased
  const [currentPolicy, setCurrentPolicy] = useState({
    id: '', // Added id for policy selection
    policyType: '',
    amount: 0,
    originalPrice: 0, // Added originalPrice for policy selection
    duration: '',
    customerName: '',
    email: '',
    address: '',
    phoneNumber: '',
    city: '',
    vehicleNumber: '',
    termsAccepted: false
  });

  // Save policies to localStorage on change
  useEffect(() => {
    localStorage.setItem('policies', JSON.stringify(policies));
  }, [policies]);

  // Set selected policy from plans - NOW ACCEPTS ID AND ORIGINALPRICE
  const selectPolicy = (id, policyType, amount, duration, originalPrice) => {
    setCurrentPolicy({
      ...currentPolicy,
      id, // Store the selected policy's ID
      policyType,
      amount,
      originalPrice, // Store original price
      duration
    });
  };

  // Add customer details to policy
  const updateCustomerDetails = (details) => {
    setCurrentPolicy({
      ...currentPolicy,
      ...details
    });
  };

  // Create final policy entry (will be refactored for Firestore later)
  const createPolicy = () => {
    const today = new Date();
    const durationInYears = parseInt(currentPolicy.duration.split(' ')[0]) || 1;
    const expiryDate = addYears(today, durationInYears);

    const newPolicy = {
      id: currentPolicy.id, // Use the selected policy ID
      policyNumber: `RSA-${format(today, 'yyMM')}-${String(policies.length + 1).padStart(3, '0')}`, // Unique policy number
      customerName: currentPolicy.customerName,
      vehicleNumber: currentPolicy.vehicleNumber,
      duration: currentPolicy.duration,
      startDate: format(today, 'dd MMM yyyy'),
      expiryDate: format(expiryDate, 'dd MMM yyyy'),
      status: 'Active',
      email: currentPolicy.email,
      address: currentPolicy.address,
      phoneNumber: currentPolicy.phoneNumber,
      city: currentPolicy.city,
      policyType: currentPolicy.policyType,
      amount: currentPolicy.amount,
      originalPrice: currentPolicy.originalPrice || currentPolicy.amount, // Ensure originalPrice is saved
      createdAt: format(today, 'yyyy-MM-dd HH:mm:ss') // Add timestamp
    };

    setPolicies([...policies, newPolicy]);
    return newPolicy;
  };

  // Lookup a policy by ID
  const getPolicyById = (id) => {
    return policies.find(policy => policy.id === id);
  };

  // Update an existing policy
  const updatePolicy = (id, updatedData) => {
    const updatedPolicies = policies.map(policy =>
      policy.id === id ? { ...policy, ...updatedData } : policy
    );
    setPolicies(updatedPolicies);
  };

  // Delete a policy
  const deletePolicy = (id) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  // Analytics data for dashboard
 const getDashboardData = () => {
  if (!policies || policies.length === 0) {
    return {
      activePolicies: 0,
      totalRevenue: 0,
      expiringSoon: 0,
      recentPolicies: [],
      policyDistribution: {
        oneYear: 0,
        twoYear: 0,
        threeYear: 0
      }
    };
  }

  const today = new Date();

  const activePolicies = policies.filter(p => p.status === 'Active').length;
  const totalRevenue = policies.reduce((sum, policy) => sum + (policy.amount || 0), 0);

  const expiringSoon = policies.filter(policy => {
    const expiry = new Date(policy.expiryDate);
    const diffInDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30 && diffInDays >= 0;
  }).length;

  const recentPolicies = [...policies]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5);

  const policyDistribution = {
    oneYear: policies.filter(p => p.duration.startsWith('1')).length,
    twoYear: policies.filter(p => p.duration.startsWith('2')).length,
    threeYear: policies.filter(p => p.duration.startsWith('3')).length,
  };

  return {
    activePolicies,
    totalRevenue,
    expiringSoon,
    recentPolicies,
    policyDistribution
  };
};


  return (
   <PolicyContext.Provider
  value={{
    policies,
    currentPolicy,
    selectPolicy,
    updateCustomerDetails,
    createPolicy,
    getPolicyById,
    updatePolicy,
    deletePolicy,
    getDashboardData,
  }}
>
  {children}
</PolicyContext.Provider>
  );
};
