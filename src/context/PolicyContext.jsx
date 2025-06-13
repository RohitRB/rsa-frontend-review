// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { format, addYears } from 'date-fns';

// const PolicyContext = createContext();

// export const usePolicy = () => useContext(PolicyContext);

// export const PolicyProvider = ({ children }) => {
//   // Initialize policies from localStorage or with sample data
//   const [policies, setPolicies] = useState(() => {
//     const storedPolicies = localStorage.getItem('policies');
//     if (storedPolicies) {
//       return JSON.parse(storedPolicies);
//     }
    
//    });

//   // Current policy data for the purchase flow
//   const [currentPolicy, setCurrentPolicy] = useState({
//     policyType: '',
//     amount: 0,
//     duration: '',
//     customerName: '',
//     email: '',
//     address: '',
//     phoneNumber: '',
//     city: '',
//     vehicleNumber: '',
//     termsAccepted: false
//   });

//   useEffect(() => {
//     // Save policies to localStorage whenever they change
//     localStorage.setItem('policies', JSON.stringify(policies));
//   }, [policies]);

//   // Function to select a policy and start the purchase flow
//   const selectPolicy = (policyType, amount, duration) => {
//     setCurrentPolicy({
//       ...currentPolicy,
//       policyType,
//       amount,
//       duration
//     });
//   };

//   // Function to update customer details
//   const updateCustomerDetails = (details) => {
//     setCurrentPolicy({
//       ...currentPolicy,
//       ...details
//     });
//   };

//   // Function to complete the purchase and create a new policy
//   const createPolicy = () => {
//     const today = new Date();
//     const expiryDate = addYears(today, parseInt(currentPolicy.duration.split(' ')[0]));
    
//     const newPolicy = {
//       id: `RSA-${format(today, 'yyMM')}-${String(policies.length + 1).padStart(3, '0')}`,
//       customerName: currentPolicy.customerName,
//       vehicleNumber: currentPolicy.vehicleNumber,
//       duration: currentPolicy.duration,
//       startDate: format(today, 'dd MMM yyyy'),
//       expiryDate: format(expiryDate, 'dd MMM yyyy'),
//       status: 'Active',
//       email: currentPolicy.email,
//       address: currentPolicy.address,
//       phoneNumber: currentPolicy.phoneNumber,
//       city: currentPolicy.city,
//       policyType: currentPolicy.policyType,
//       amount: currentPolicy.amount
//     };
    
//     setPolicies([...policies, newPolicy]);
//     return newPolicy;
//   };

//   // Function to get policy by ID
//   const getPolicyById = (id) => {
//     return policies.find(policy => policy.id === id);
//   };

//   // Function to update a policy
//   const updatePolicy = (id, updatedData) => {
//     const updatedPolicies = policies.map(policy => 
//       policy.id === id ? { ...policy, ...updatedData } : policy
//     );
//     setPolicies(updatedPolicies);
//   };

//   // Function to delete a policy
//   const deletePolicy = (id) => {
//     setPolicies(policies.filter(policy => policy.id !== id));
//   };

//   // Analytics data for admin dashboard
//   const getDashboardData = () => {
//     const activePolicies = policies.filter(p => p.status === 'Active').length;
//     const totalRevenue = policies.reduce((sum, policy) => sum + policy.amount, 0);
//     const expiringSoon = policies.filter(p => p.status === 'Expiring Soon').length;
//     const recentPolicies = [...policies].sort((a, b) => {
//       return new Date(b.startDate) - new Date(a.startDate);
//     }).slice(0, 5);
    
//     // Calculate policy distribution
//     const oneYearPolicies = policies.filter(p => p.duration === '1 Year').length;
//     const twoYearPolicies = policies.filter(p => p.duration === '2 Years').length;
//     const threeYearPolicies = policies.filter(p => p.duration === '3 Years').length;
//     const total = policies.length || 1; // Avoid division by zero
    
//     const policyDistribution = {
//       oneYear: Math.round((oneYearPolicies / total) * 100),
//       twoYear: Math.round((twoYearPolicies / total) * 100),
//       threeYear: Math.round((threeYearPolicies / total) * 100),
//     };
    
//     return {
//       activePolicies,
//       totalRevenue,
//       expiringSoon,
//       recentPolicies,
//       policyDistribution
//     };
//   };

//   const value = {
//     currentPolicy,
//     policies,
//     selectPolicy,
//     updateCustomerDetails,
//     createPolicy,
//     getPolicyById,
//     updatePolicy,
//     deletePolicy,
//     getDashboardData
//   };

//   return (
//     <PolicyContext.Provider value={value}>
//       {children}
//     </PolicyContext.Provider>
//   );
// };

// export default PolicyContext;







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
    policyType: '',
    amount: 0,
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

  // Set selected policy from plans
  const selectPolicy = (policyType, amount, duration) => {
    setCurrentPolicy({
      ...currentPolicy,
      policyType,
      amount,
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

  // Create final policy entry
  const createPolicy = () => {
    const today = new Date();
    const durationInYears = parseInt(currentPolicy.duration.split(' ')[0]) || 1;
    const expiryDate = addYears(today, durationInYears);

    const newPolicy = {
      id: `RSA-${format(today, 'yyMM')}-${String(policies.length + 1).padStart(3, '0')}`,
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
      amount: currentPolicy.amount
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
