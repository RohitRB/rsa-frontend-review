// src/pages/Payment.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { usePolicy } from '../../context/PolicyContext';
import { CreditCard } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { currentPolicy, verifyPaymentAndCreatePolicy } = usePolicy();
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const finalAmount = currentPolicy.amount;

  useEffect(() => {
    if (!currentPolicy.policyType || !currentPolicy.customerName) {
      navigate('/');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK. Check network or script URL.');
      alert('Failed to load payment SDK. Please check your internet connection or try again later.');
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
  }, [currentPolicy, navigate]);

  const handleBack = () => {
    navigate('/customer-details');
  };

  const handlePayment = async () => {
    setIsLoading(true);

    if (finalAmount <= 0) {
      try {
        const zeroAmountPolicy = await verifyPaymentAndCreatePolicy('ZERO_PAYMENT_ID', 'ZERO_ORDER_ID', 'ZERO_SIGNATURE');
        navigate('/confirmation', {
          state: {
            policy: zeroAmountPolicy,
            paymentStatus: 'success',
          },
        });
      } catch (error) {
        console.error('Error with zero amount policy creation:', error);
        alert(`Policy creation failed for zero amount: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!isScriptLoaded || !window.Razorpay) {
      console.warn('Razorpay SDK not loaded. Cannot initiate payment.');
      alert('Payment system is not ready. Please try again in a moment.');
      setIsLoading(false);
      return;
    }

    try {
      // Use backend URL for local development, fallback to Vercel API for production
      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';
      const orderResponse = await fetch(`${backendUrl}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: finalAmount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order.');
      }

      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID || 'rzp_live_yYGWUPovOauhOx',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Kalyan EnterPrises',
        description: 'Policy Purchase',
        order_id: orderData.id,
        handler: async function (response) {
          setIsLoading(true);
          try {
            const savedPolicy = await verifyPaymentAndCreatePolicy(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            navigate('/confirmation', {
              state: {
                policy: savedPolicy,
                paymentStatus: 'success',
              },
            });
          } catch (error) {
            console.error('Error during payment verification process:', error);
            navigate('/confirmation', {
              state: {
                policy: currentPolicy,
                paymentStatus: 'fail',
                errorMessage: error.message || 'Payment processing failed after initiation.',
              },
            });
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            navigate('/confirmation', {
              state: {
                policy: currentPolicy,
                paymentStatus: 'fail',
              },
            });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      alert(`Payment initiation failed: ${error.message || 'Something went wrong.'}`);
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
                <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{finalAmount}</span>
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
                disabled={isLoading || !isScriptLoaded}
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
