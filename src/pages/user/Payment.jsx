import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { usePolicy } from '../../context/PolicyContext';
import { CreditCard } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { currentPolicy, createPolicy } = usePolicy();
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); // New state to track script loading

  // --- START Changes for GST Calculation ---
  // No GST calculation needed if price is inclusive
  const finalAmount = currentPolicy.amount; // Price is now inclusive of all taxes
  // --- END Changes for GST Calculation ---

  useEffect(() => {
    if (!currentPolicy.policyType || !currentPolicy.customerName) {
      navigate('/');
    }

    // --- START Change for Razorpay Script Loading ---
    // Load Razorpay script once on component mount
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true); // Set state to true when script loads
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK.');
      alert('Failed to load payment SDK. Please try again.');
    };
    document.body.appendChild(script);

    // Cleanup script on unmount
    return () => {
      // Check if the script exists before trying to remove it
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
    // --- END Change for Razorpay Script Loading ---

  }, [currentPolicy, navigate]);

  const handleBack = () => {
    navigate('/customer-details');
  };

  // --- START TEMPORARY DEBUGGING LOG ---
  console.log("Current Policy Data (before payment button click):", currentPolicy);
  // --- END TEMPORARY DEBUGGING LOG ---

  const handlePayment = async () => {
    setIsLoading(true);

    // ✅ If amount is 0, skip Razorpay
    if (finalAmount <= 0) { // Use finalAmount here
      const newPolicy = createPolicy();
      navigate('/confirmation', { state: { policy: newPolicy } });
      setIsLoading(false); // Ensure loading state is reset
      return;
    }

    // Ensure Razorpay script is loaded before proceeding
    if (!isScriptLoaded || !window.Razorpay) {
      alert('Payment SDK not loaded. Please try again in a moment.');
      setIsLoading(false);
      return;
    }

    try {
      // Using Vercel environment variable for backend URL (from previous steps)
      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_APP_BACKEND_URL is not defined!');
        alert('Backend URL is not configured. Please contact support.');
        setIsLoading(false);
        return;
      }

      const orderResponse = await fetch(`${backendUrl}/create-order`, { // Use backendUrl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: finalAmount * 100 }), // Razorpay expects amount in paisa
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order on backend.');
      }

      const orderData = await orderResponse.json();

      const options = {
        key: 'rzp_live_yYGWUPovOauhOx', // Live key
        amount: orderData.amount, // Amount from backend (should be in paisa)
        currency: orderData.currency,
        name: 'Kalyan EnterPrises',
        description: 'Policy Purchase',
        order_id: orderData.id,
        handler: function (response) {
          // --- START Change for payment success handling ---
          // Call createPolicy here after successful payment
          // newPolicy will be further saved to Firestore in a later step
          const newPolicy = createPolicy(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
          navigate('/confirmation', {
            state: {
              policy: newPolicy,
              paymentStatus: 'success', // Pass status for confirmation page
            },
          });
          // --- END Change for payment success handling ---
        },
        prefill: {
          name: currentPolicy.customerName,
          email: currentPolicy.email || 'customer@example.com', // Use customer's email or a fallback
          contact: currentPolicy.phoneNumber, // Use customer's phone number!
        },
        theme: {
          color: '#528FF0',
        },
        modal: {
          ondismiss: function () {
            navigate('/confirmation', {
              state: {
                policy: currentPolicy,
                paymentStatus: 'fail', // Pass status for confirmation page
              },
            });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message || 'Something went wrong while processing payment.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentPolicy.policyType) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment</h1>
          <p className="text-gray-600 mb-6">Complete your purchase securely</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="border rounded-md p-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{currentPolicy.policyType}</span>
                  <span>₹{currentPolicy.amount}</span>
                </div>
                {/* --- START Changes for GST Display --- */}
                {/* Remove GST display if price is inclusive
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{gstAmount}</span>
                </div>
                */}
                {/* --- END Changes for GST Display --- */}
                <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{finalAmount}</span> {/* Use finalAmount here */}
                </div>
              </div>
            </div>

            {/* Razorpay Section */}
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Razorpay</h2>
                <CreditCard className="text-blue-600" />
              </div>

              <p className="text-gray-600 mb-4 text-sm">
                Secure payment powered by Razorpay.
              </p>

              <button
                onClick={handlePayment}
                disabled={isLoading || !isScriptLoaded} // Disable if script not loaded
                className={`w-full py-3 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  ${isLoading || !isScriptLoaded ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 
                        0 0 5.373 0 12h4zm2 
                        5.291A7.962 7.962 0 014 
                        12H0c0 3.042 1.135 5.824 3 
                        7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${finalAmount}`
                )}
              </button>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
