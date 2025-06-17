// src/context/PolicyContext.jsx

import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { format, addYears, addDays, isBefore } from 'date-fns';

// Import Firebase Client SDK functions
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, orderBy, doc, getDocs, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

const PolicyContext = createContext();

export const usePolicy = () => useContext(PolicyContext);

export const PolicyProvider = ({ children }) => {
  // Firebase and Auth State
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // To ensure auth is ready before Firestore ops

  // Policies and Customers state (now from Firestore)
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const initRef = useRef(false); // To ensure Firebase init runs only once

  // 1. Initialize Firebase App and Authenticate
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    try {
      // --- CRITICAL FIX: Read Firebase config from Vercel-compatible environment variable ---
      const firebaseConfigString = import.meta.env.VITE_APP_FIREBASE_CONFIG;
      let firebaseConfig;

      if (firebaseConfigString) {
        try {
          firebaseConfig = JSON.parse(firebaseConfigString);
        } catch (parseError) {
          console.error("Error parsing VITE_APP_FIREBASE_CONFIG environment variable:", parseError);
          // If parsing fails, firebaseConfig remains undefined/null, which will trigger the !firebaseConfig check below
        }
      } else {
        console.error("VITE_APP_FIREBASE_CONFIG is NOT set in Vercel environment variables. Using Canvas fallback (if available).");
        // Fallback to __firebase_config for Canvas or local dev if not using Vercel env
        firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
      }

      if (!firebaseConfig || !firebaseConfig.apiKey) { // Added check for apiKey existence
        console.error("Firebase config is ultimately not available or incomplete. Cannot initialize Firebase.");
        return;
      }

      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Sign in using custom token or anonymously
      const signInUser = async () => {
        try {
          // Use Vercel-compatible env var for initial auth token as well
          const initialAuthToken = import.meta.env.VITE_APP_INITIAL_AUTH_TOKEN || (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);

          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
            console.log("Signed in with custom token.");
          } else {
            await signInAnonymously(firebaseAuth);
            console.log("Signed in anonymously.");
          }
        } catch (error) {
          console.error("Firebase authentication error:", error);
        }
      };

      signInUser();

      // Listen for auth state changes
      const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserId(user.uid);
          console.log("Auth state changed, user ID:", user.uid);
        } else {
          setUserId(null);
          console.log("Auth state changed, no user.");
        }
        setIsAuthReady(true);
      });

      return () => unsubscribeAuth();
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  }, []);


  // 2. Real-time Listeners for Policies and Customers (after auth is ready)
  useEffect(() => {
    if (!db || !isAuthReady || !userId) {
      console.log("Firestore or Auth not ready, skipping data listeners.");
      return;
    }

    console.log("Setting up Firestore listeners for policies and customers...");

    // Policies Listener
    const policiesRef = collection(db, 'policies');
    const policiesQuery = query(policiesRef, orderBy('createdAt', 'desc'));
    const unsubscribePolicies = onSnapshot(policiesQuery, (snapshot) => {
      const fetchedPolicies = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamps to JavaScript Date objects for consistent frontend use
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || null),
          startDate: data.startDate ? new Date(data.startDate) : null, // Assuming backend sends string
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null, // Assuming backend sends string
        };
      });
      setPolicies(fetchedPolicies);
      console.log(`Fetched ${fetchedPolicies.length} policies from Firestore.`);
    });

    // Customers Listener
    const customersRef = collection(db, 'customers');
    const customersQuery = query(customersRef, orderBy('createdAt', 'desc'));
    const unsubscribeCustomers = onSnapshot(customersQuery, (snapshot) => {
      const fetchedCustomers = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || null),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || null),
        };
      });
      setCustomers(fetchedCustomers);
      console.log(`Fetched ${fetchedCustomers.length} customers from Firestore.`);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribePolicies();
      unsubscribeCustomers();
      console.log("Firestore listeners unsubscribed.");
    };
  }, [db, isAuthReady, userId]);

  // Current policy being created/purchased (unchanged)
  const [currentPolicy, setCurrentPolicy] = useState({
    id: '',
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

  // Select policy (unchanged)
  const selectPolicy = (id, policyType, amount, duration, originalPrice) => {
    setCurrentPolicy(prev => ({
      ...prev,
      id,
      policyType,
      amount,
      originalPrice: originalPrice || amount,
      duration
    }));
  };

  // Update customer details (unchanged)
  const updateCustomerDetails = (details) => {
    setCurrentPolicy(prev => ({
      ...prev,
      ...details
    }));
  };

  // Verify payment and create policy - FIX FOR CONFIRMATION PAGE DATA
  const verifyPaymentAndCreatePolicy = async (paymentId, orderId, signature) => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_APP_BACKEND_URL is not defined!');
      throw new Error('Backend URL is not configured.');
    }

    const today = new Date();
    const durationInYears = parseInt(currentPolicy.duration.split(' ')[0]) || 1;
    const expiryDate = addYears(today, durationInYears);

    const policyDataToSend = {
      id: currentPolicy.id,
      policyNumber: `RSA-${format(today, 'yyMMddHHmmss')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      policyType: currentPolicy.policyType,
      amount: currentPolicy.amount,
      originalPrice: currentPolicy.originalPrice || currentPolicy.amount,
      duration: currentPolicy.duration,
      startDate: format(today, 'yyyy-MM-dd'),
      expiryDate: format(expiryDate, 'yyyy-MM-dd'),
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
        setCurrentPolicy({}); // Clear current policy after successful creation for next flow

        // Return the data needed for Confirmation page,
        // NOW ENSURING CUSTOMER DETAILS ARE INCLUDED FROM currentPolicy
        return {
          ...policyDataToSend,
          ...customerDataToSend, // <<< THIS IS THE CRITICAL LINE TO ENSURE CUSTOMER DATA IS PASSED
          status: 'Active',
          firestorePolicyId: data.policyId,
          firestoreCustomerId: data.customerId,
          createdAt: today, // Pass original Date objects for consistent formatting in Confirmation.jsx
          startDate: today,
          expiryDate: expiryDate
        };
      } else {
        console.error('❌ Backend verification failed:', data.message);
        throw new Error(data.message || 'Payment verification failed.');
      }
    } catch (error) {
      console.error('Error during backend payment verification:', error);
      throw error;
    }
  };

  // Analytics data for dashboard
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
      const expiry = policy.expiryDate instanceof Date ? policy.expiryDate : new Date(policy.expiryDate);
      const diffInDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diffInDays <= 30 && diffInDays >= 0;
    }).length;

    const recentPolicies = [...policies]
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
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

  // CRUD operations for policies directly interacting with Firestore
  const getPolicyById = (id) => {
    return policies.find(policy => policy.id === id || policy.policyNumber === id);
  };

  // Firestore Delete Policy
  const deletePolicy = async (policyFirestoreId) => {
    if (!db) {
      console.error("Firestore DB not initialized for deletePolicy.");
      return;
    }
    try {
      // Check if the policy has a firestorePolicyId (meaning it's in DB)
      const policyToDelete = policies.find(p => p.firestorePolicyId === policyFirestoreId || p.id === policyFirestoreId);
      if (policyToDelete && policyToDelete.firestorePolicyId) {
        await deleteDoc(doc(db, 'policies', policyToDelete.firestorePolicyId));
        console.log("Policy successfully deleted from Firestore!");
        // onSnapshot listener will automatically update local state
      } else {
        console.warn("Policy not found in Firestore or missing firestorePolicyId, deleting from local state only.");
        setPolicies(prev => prev.filter(p => p.id !== policyFirestoreId && p.policyNumber !== policyFirestoreId));
      }
    } catch (error) {
      console.error("Error deleting policy from Firestore:", error);
    }
  };

  // Firestore Update Policy
  const updatePolicyInFirestore = async (policyId, updatedFields) => {
    if (!db) {
      console.error("Firestore DB not initialized for updatePolicyInFirestore.");
      return;
    }
    try {
      const policyRef = doc(db, 'policies', policyId);
      await updateDoc(policyRef, updatedFields);
      console.log("Policy successfully updated in Firestore!");
    } catch (error) {
      console.error("Error updating policy in Firestore:", error);
    }
  };

  // Firestore Delete Customer
  const deleteCustomer = async (customerFirestoreId) => {
    if (!db) {
      console.error("Firestore DB not initialized for deleteCustomer.");
      return;
    }
    try {
      await deleteDoc(doc(db, 'customers', customerFirestoreId));
      console.log("Customer successfully deleted from Firestore!");
      // onSnapshot listener will automatically update local state
    } catch (error) {
      console.error("Error deleting customer from Firestore:", error);
    }
  };

  // Firestore Update Customer
  const updateCustomerInFirestore = async (customerDocId, updatedFields) => {
    if (!db) {
      console.error("Firestore DB not initialized for updateCustomerInFirestore.");
      return;
    }
    try {
      const customerRef = doc(db, 'customers', customerDocId);
      await updateDoc(customerRef, updatedFields);
      console.log("Customer successfully updated in Firestore!");
    } catch (error) {
      console.error("Error updating customer in Firestore:", error);
    }
  };


  return (
    <PolicyContext.Provider
      value={{
        policies,
        customers, // Expose customers array
        currentPolicy,
        selectPolicy,
        updateCustomerDetails,
        verifyPaymentAndCreatePolicy,
        getPolicyById,
        deletePolicy, // Expose Firestore delete
        updatePolicyInFirestore, // Expose Firestore update
        deleteCustomer, // Expose Firestore delete for customers
        updateCustomerInFirestore, // Expose Firestore update for customers
        getDashboardData,
        userId,
        isAuthReady
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
};
