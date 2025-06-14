import React, { createContext, useState, useEffect, useContext } from 'react';
import { format, addYears } from 'date-fns';

const PolicyContext = createContext();

export const usePolicy = () => useContext(PolicyContext);

export const PolicyProvider = ({ children }) => {
  // Policies list (for admin & history) - now will reflect Firestore data eventually
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
    id: '', // Policy ID (e.g., Kalyan_001)
    policyType: '',
    amount: 0,
    originalPrice: 0,
    duration: '',
    customerName: '',
    email: '',
    address: '',
    phoneNumber: '',
    city: '',
    vehicleNumber: '',
    termsAccepted: false
  });

  // Save policies to localStorage on change (for temporary client-side view)
  useEffect(() => {
    localStorage.setItem('policies', JSON.stringify(policies));
  }, [policies]);

  // Set selected policy from plans
  const selectPolicy = (id, policyType, amount, duration, originalPrice) => {
    setCurrentPolicy(prev => ({
      ...prev,
      id,
      policyType,
      amount,
      originalPrice: originalPrice || amount, // Ensure originalPrice is set
      duration
    }));
  };

  // Add customer details to policy
  const updateCustomerDetails = (details) => {
    setCurrentPolicy(prev => ({
      ...prev,
      ...details
    }));
  };

  // NEW: Function to verify payment with backend and save policy to Firestore
  const verifyPaymentAndCreatePolicy = async (paymentId, orderId, signature) => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_APP_BACKEND_URL is not defined!');
      throw new Error('Backend URL is not configured.');
    }

    // Prepare policy and customer data to send to backend
    const today = new Date();
    const durationInYears = parseInt(currentPolicy.duration.split(' ')[0]) || 1;
    const expiryDate = addYears(today, durationInYears);

    const policyDataToSend = {
      id: currentPolicy.id, // Policy ID (e.g., Kalyan_001)
      policyNumber: `RSA-${format(today, 'yyMMddHHmmss')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, // More unique policy number
      policyType: currentPolicy.policyType,
      amount: currentPolicy.amount,
      originalPrice: currentPolicy.originalPrice || currentPolicy.amount,
      duration: currentPolicy.duration,
      startDate: format(today, 'yyyy-MM-dd'), // Send consistent date format
      expiryDate: format(expiryDate, 'yyyy-MM-dd'), // Send consistent date format
      // status will be set to 'Active' by backend
    };

    const customerDataToSend = {
      customerName: currentPolicy.customerName,
      email: currentPolicy.email,
      phoneNumber: currentPolicy.phoneNumber,
      address: currentPolicy.address,
      city: currentPolicy.city,
      vehicleNumber: currentPolicy.vehicleNumber,
    };

    try {
      const response = await fetch(`${backendUrl}/api/payments/verify-and-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          policyData: policyDataToSend,
          customerData: customerDataToSend,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Backend verification successful. Policy and Customer saved to Firestore.');
        const savedPolicy = {
          ...policyDataToSend,
          status: 'Active',
          firestorePolicyId: data.policyId, // Store Firestore ID for future reference
          firestoreCustomerId: data.customerId, // Store Firestore ID for future reference
          createdAt: format(today, 'dd MMM yyyy HH:mm:ss'), // Use readable format for frontend
          // Note: Backend handles exact dates for DB. Frontend uses simplified for display.
          startDate: format(today, 'dd MMM yyyy'),
          expiryDate: format(expiryDate, 'dd MMM yyyy')
        };
        setPolicies(prevPolicies => [...prevPolicies, savedPolicy]);
        setCurrentPolicy({}); // Clear current policy after successful creation
        return savedPolicy; // Return the saved policy object
      } else {
        console.error('❌ Backend verification failed:', data.message);
        throw new Error(data.message || 'Payment verification failed.');
      }
    } catch (error) {
      console.error('Error during backend payment verification:', error);
      throw error; // Re-throw to be caught in Payment.jsx
    }
  };

  // Frontend functions to interact with policies (still using local storage for now)
  const getPolicyById = (id) => {
    return policies.find(policy => policy.id === id || policy.policyNumber === id);
  };

  const updatePolicy = (id, updatedData) => {
    const updatedPolicies = policies.map(policy => 
      (policy.id === id || policy.policyNumber === id) ? { ...policy, ...updatedData } : policy
    );
    setPolicies(updatedPolicies);
  };

  const deletePolicy = (id) => {
    setPolicies(policies.filter(policy => policy.id !== id && policy.policyNumber !== id));
  };

  // Analytics data for dashboard (still using local storage for now)
  const getDashboardData = () => {
    if (!policies || policies.length === 0) {
      return {
        activePolicies: 0,
        totalRevenue: 0,
        expiringSoon: 0,
        recentPolicies: [],
        policyDistribution: { oneYear: 0, twoYear: 0, threeYear: 0 }
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
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)) // Sort by createdAt
      .slice(0, 5);

    const policyDistribution = {
      oneYear: policies.filter(p => p.duration && p.duration.startsWith('1')).length,
      twoYear: policies.filter(p => p.duration && p.duration.startsWith('2')).length,
      threeYear: policies.filter(p => p.duration && p.duration.startsWith('3')).length,
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
    verifyPaymentAndCreatePolicy, // Export the new function
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
