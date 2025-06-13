// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';
// import Stepper from '../../components/Stepper';
// import { usePolicy } from '../../context/PolicyContext';
// import { CreditCard } from 'lucide-react';

// const Payment = () => {
//   const navigate = useNavigate();
//   const { currentPolicy, createPolicy } = usePolicy();
//   const [isLoading, setIsLoading] = useState(false);

//   const gstAmount = Math.round(currentPolicy.amount * 0.18);
//   const totalAmount = currentPolicy.amount + gstAmount;

//   useEffect(() => {
//     if (!currentPolicy.policyType || !currentPolicy.customerName) {
//       navigate('/');
//     }

//     // Load Razorpay script once on mount
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     document.body.appendChild(script);
//   }, [currentPolicy, navigate]);

//   const handleBack = () => {
//     navigate('/customer-details');
//   };

//   const handlePayment = async () => {
//     setIsLoading(true);

//     try {
//       const orderResponse = await fetch('https://rsa-backend.onrender.com/create-order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: totalAmount }),
//       });

//       const orderData = await orderResponse.json();

//       const options = {
//         key: 'rzp_live_G8xxtyxOLZ2K4T', // Replace with test key during development
//         Amount: orderData.amount,
//         Currency: orderData.currency,
//         Name: 'Kalyan Enterprises',
//         Description: 'Policy Purchase',
//         Order_id: orderData.id,
//         handler: function (response) {
//           const newPolicy = createPolicy();
//           localStorage.setItem('policy', JSON.stringify(newPolicy));

//           navigate('/confirmation', {
//             state: {
//               policy: newPolicy,
//               paymentStatus: 'success',
//               paymentId: response.razorpay_payment_id,
//             },
//           });
//         },
//         prefill: {
//           name: currentPolicy.customerName,
//           email: 'demo@example.com',
//           contact: '9389916233',
//         },
//         theme: { color: '#528FF0' },
//         modal: {
//           ondismiss: function () {
//             navigate('/confirmation', {
//               state: {
//                 policy: currentPolicy,
//                 paymentStatus: 'fail',
//               },
//             });
//           },
//         },
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       console.error('Payment error:', error);
//       alert('Something went wrong while processing payment.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!currentPolicy.policyType) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header />
//       <Stepper />
//       <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment</h1>
//           <p className="text-gray-600 mb-6">Complete your purchase securely</p>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Order Summary */}
//             <div className="border rounded-md p-4">
//               <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>{currentPolicy.policyType}</span>
//                   <span>₹{currentPolicy.amount}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>GST (18%)</span>
//                   <span>₹{gstAmount}</span>
//                 </div>
//                 <div className="border-t pt-3 mt-3 flex justify-between font-bold">
//                   <span>Total</span>
//                   <span>₹{totalAmount}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Razorpay Section */}
//             <div className="border rounded-md p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Razorpay</h2>
//                 <CreditCard className="text-blue-600" />
//               </div>

//               <p className="text-gray-600 mb-4 text-sm">
//                 Secure payment powered by Razorpay.
//               </p>

//               <button
//                 onClick={handlePayment}
//                 disabled={isLoading}
//                 className={`w-full py-3 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
//                   ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 
//                         0 0 5.373 0 12h4zm2 
//                         5.291A7.962 7.962 0 014 
//                         12H0c0 3.042 1.135 5.824 3 
//                         7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   `Pay ₹${totalAmount}`
//                 )}
//               </button>

//               <div className="mt-4 flex justify-between">
//                 <button
//                   onClick={handleBack}
//                   className="text-gray-600 hover:text-gray-800 transition-colors"
//                 >
//                   Back
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Payment;


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

  // GST (18%) calculation
  const gstAmount = Math.round(currentPolicy.amount * 0.18);
  const totalAmount = currentPolicy.amount + gstAmount;

  useEffect(() => {
    if (!currentPolicy.policyType || !currentPolicy.customerName) {
      navigate('/');
    }
  }, [currentPolicy, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBack = () => {
    navigate('/customer-details');
  };

  // const handlePayment = async () => {
  //   setIsLoading(true);

  //   const res = await loadRazorpayScript();
  //   if (!res) {
  //     alert('Failed to load Razorpay SDK.');
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const orderResponse = await fetch('https://rsa-backend.onrender.com/create-order', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ amount: totalAmount }), // Send amount to backend
  //     });

  //     const orderData = await orderResponse.json();

  //     const options = {
  //       key: 'rzp_live_yYGWUPovOauhOx', // Replace with your live key
  //       amount: orderData.amount,
  //       currency: orderData.currency,
  //       name: 'Kalyan EnterPrises',
  //       description: 'Policy Purchase',
  //       order_id: orderData.id,
  //       handler: function (response) {
  //         const newPolicy = createPolicy();
  //         setIsLoading(true);
  //         setTimeout(() => {
  //           navigate('/confirmation', { state: { policy: newPolicy } });
  //         }, 1000);
  //       },
  //       prefill: {
  //         name: currentPolicy.customerName,
  //         email: 'demo@example.com', // Optional: replace dynamically
  //         contact: '9389916233', // Optional: replace dynamically
  //       },
  //       theme: {
  //         color: '#528FF0',
  //       },
  //     };

  //     const paymentObject = new window.Razorpay(options);
  //     paymentObject.open();
  //   } catch (error) {
  //     console.error('Payment error:', error);
  //     alert('Something went wrong.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };





  
  const handlePayment = async () => {
    setIsLoading(true);

    // ✅ If amount is 0, skip Razorpay
    if (totalAmount <= 0) {
      const newPolicy = createPolicy();
      navigate('/confirmation', { state: { policy: newPolicy } });
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      setIsLoading(false);
      return;
    }

    try {
      const orderResponse = await fetch('https://rsa-backend.onrender.com/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await orderResponse.json();

      const options = {
        key: 'rzp_live_yYGWUPovOauhOx', // Live key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Kalyan EnterPrises',
        description: 'Policy Purchase',
        order_id: orderData.id,
        handler: function (response) {
          const newPolicy = createPolicy();
          setIsLoading(true);
          setTimeout(() => {
            navigate('/confirmation', { state: { policy: newPolicy } });
          }, 1000);
        },
        prefill: {
          name: currentPolicy.customerName,
          email: 'demo@example.com',
          contact: '9389916233',
        },
        theme: {
          color: '#528FF0',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong.');
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
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
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
                disabled={isLoading}
                className={`w-full py-3 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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
                  `Pay ₹${totalAmount}`
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