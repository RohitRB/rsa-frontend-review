import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { format, addYears } from 'date-fns';

// Import Firebase Client SDK functions
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, orderBy, doc, getDocs } from 'firebase/firestore';
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
      const firebaseConfig = typeof __firebase_config !== 'undefined'
        ? JSON.parse(__firebase_config)
        : null; // Fallback for local dev if __firebase_config not set

      if (!firebaseConfig) {
        console.error("Firebase config is not available. Please ensure __firebase_config is set.");
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
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
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
    const policiesQuery = query(collection(db, 'policies'), orderBy('createdAt', 'desc'));
    const unsubscribePolicies = onSnapshot(policiesQuery, (snapshot) => {
      const fetchedPolicies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPolicies(fetchedPolicies);
      console.log(`Fetched ${fetchedPolicies.length} policies from Firestore.`);
    });

    // Customers Listener
    const customersQuery = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
    const unsubscribeCustomers = onSnapshot(customersQuery, (snapshot) => {
      const fetchedCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(fetchedCustomers);
      console.log(`Fetched ${fetchedCustomers.length} customers from Firestore.`);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribePolicies();
      unsubscribeCustomers();
      console.log("Firestore listeners unsubscribed.");
    };
  }, [db, isAuthReady, userId]); // Dependencies ensure listeners re-run if these change

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

  // Verify payment and create policy (unchanged, but now data is from state backed by Firestore)
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
        // The `policies` state will be updated by the Firestore listener,
        // so we don't directly call setPolicies here for new policy.
        setCurrentPolicy({}); // Clear current policy after successful creation

        // Return the data needed for Confirmation page, now including customerDetails
        return {
          ...policyDataToSend,
          ...data.customerDetails, // Include full customer details
          status: 'Active',
          firestorePolicyId: data.policyId,
          firestoreCustomerId: data.customerId,
          createdAt: format(today, 'dd MMM. yyyy HH:mm:ss'),
          startDate: format(today, 'dd MMM. yyyy'),
          expiryDate: format(expiryDate, 'dd MMM. yyyy')
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

  // Analytics data for dashboard (now uses policies and customers from Firestore)
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
      const expiry = new Date(policy.expiryDate); // expiryDate is in 'yyyy-MM-dd' format from Firestore
      const diffInDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diffInDays <= 30 && diffInDays >= 0;
    }).length;

    const recentPolicies = [...policies]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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

  // CRUD operations for policies (now directly using Firestore `db` if needed, but not exposed globally here)
  // For simplicity, these functions will currently operate on the local 'policies' state
  // that is populated by the onSnapshot listener. If direct writes are needed from frontend,
  // they would need to use Firebase client SDK write operations.
  const getPolicyById = (id) => {
    return policies.find(policy => policy.id === id || policy.policyNumber === id);
  };

  // Note: updatePolicy and deletePolicy below would typically write back to Firestore.
  // For the admin panel, these operations will need their own Firestore logic.
  // For now, they will only update the local state which is then overwritten by onSnapshot.
  const updatePolicy = (id, updatedData) => {
    console.warn("updatePolicy in PolicyContext: This currently only updates local state. For persistence, implement Firestore updateDoc.");
    const updatedPolicies = policies.map(policy => 
      (policy.id === id || policy.policyNumber === id) ? { ...policy, ...updatedData } : policy
    );
    setPolicies(updatedPolicies);
  };

  const deletePolicy = (id) => {
    console.warn("deletePolicy in PolicyContext: This currently only updates local state. For persistence, implement Firestore deleteDoc.");
    setPolicies(policies.filter(policy => policy.id !== id && policy.policyNumber !== id));
  };

  return (
    <PolicyContext.Provider
      value={{
        policies,
        customers, // Expose customers as well
        currentPolicy,
        selectPolicy,
        updateCustomerDetails,
        verifyPaymentAndCreatePolicy,
        getPolicyById,
        updatePolicy,
        deletePolicy,
        getDashboardData,
        userId, // Expose userId for potential admin page authentication/display
        isAuthReady // Expose auth ready state
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
};
