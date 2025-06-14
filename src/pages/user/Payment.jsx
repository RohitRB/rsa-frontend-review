import React, { useState, useEffect } => {
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
        console.error('Failed to load Razorpay SDK.');
        alert('Failed to load payment SDK. Please try again.');
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
      console.log("handlePayment function triggered."); // NEW LOG
      setIsLoading(true);

      if (finalAmount <= 0) {
        try {
          const zeroAmountPolicy = await verifyPaymentAndCreatePolicy('N/A_PAYMENT_ID', 'N/A_ORDER_ID', 'N/A_SIGNATURE');
          navigate('/confirmation', {
            state: {
              policy: zeroAmountPolicy,
              paymentStatus: 'success',
            },
          });
        } catch (error) {
          console.error('Error with zero amount policy creation:', error);
          alert(`Policy creation failed: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (!isScriptLoaded || !window.Razorpay) {
        alert('Payment SDK not loaded. Please try again in a moment.');
        setIsLoading(false);
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
        if (!backendUrl) {
          console.error('VITE_APP_BACKEND_URL is not defined!');
          alert('Backend URL is not configured. Please contact support.');
          setIsLoading(false);
          return;
        }

        console.log("Attempting to create order with amount:", finalAmount);
        const orderResponse = await fetch(`${backendUrl}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalAmount }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          console.error("Error response from create-order:", errorData);
          throw new Error(errorData.message || 'Failed to create order on backend.');
        }

        const orderData = await orderResponse.json();
        console.log("Razorpay Order Data from Backend:", orderData);

        const options = {
          key: 'rzp_live_yYGWUPovOauhOx',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Kalyan EnterPrises',
          description: 'Policy Purchase',
          order_id: orderData.id,
          prefill: {
            name: currentPolicy.customerName,
            email: currentPolicy.email || 'customer@example.com',
            contact: currentPolicy.phoneNumber,
          },
          theme: {
            color: '#528FF0',
          },
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
                errorMessage: 'Payment cancelled by user.',
              },
            });
          },
        },
      };

      console.log("Razorpay Options being sent:", options);
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
```
The "payment-component-debug" is what's currently open.Thank you for providing this detailed console output and the updated code!

This new information is incredibly helpful. The "This page failed to load a stylesheet from a URL" error is definitely a problem, but it seems to be an issue Razorpay itself is having with loading external assets (like Google Fonts) *after* its core script loads. This doesn't necessarily block the payment process but can affect the appearance of the popup.

**The most crucial observation from your latest console output is the *absence* of the custom `console.log` messages we added to `Payment.jsx` that were supposed to show:**

* `"handlePayment function triggered."`
* `"Attempting to create order with amount:"`
* `"Razorpay Order Data from Backend:"`
* `"Razorpay Options being sent:"`

This tells us that the `handlePayment` function itself is **not being executed** when you click the "Pay ₹1" button. This is why the `create-order` network request isn't showing, and why Razorpay isn't fully initiating.

### **The Problem:**

The `handlePayment` function is likely being prevented from executing because the button it's attached to (`onClick={handlePayment}`) is `disabled`.

Looking at the `Payment.jsx` code:

```jsx
<button
  onClick={handlePayment}
  disabled={isLoading || !isScriptLoaded} // <-- This is the key line
  className={`w-full py-3 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    ${isLoading || !isScriptLoaded ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
>
```

The button is `disabled` if `isLoading` is true OR if `isScriptLoaded` is false.

* `isLoading` is initially `false` and set to `true` when `handlePayment` is called.
* `isScriptLoaded` is initially `false` and set to `true` **when the Razorpay script finishes loading.**

**It appears that `isScriptLoaded` is *not* becoming `true`, or the `onload` event for the script is not firing as expected.** This would keep the button disabled and prevent `handlePayment` from running.

---

### **Let's diagnose why `isScriptLoaded` is false.**

**Action for you: Add another `console.log` to track the script loading.**

I will update `Payment.jsx` again. This time, we'll confirm if the script is ever successfully loading.


```jsx
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

    console.log("Attempting to load Razorpay script..."); // NEW LOG: Before script creation
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
      console.log("Razorpay script loaded successfully!"); // NEW LOG: On successful load
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK.');
      alert('Failed to load payment SDK. Please try again.');
      console.log("Razorpay script failed to load!"); // NEW LOG: On error
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
    console.log("handlePayment function triggered.");
    setIsLoading(true);

    if (finalAmount <= 0) {
      try {
        const zeroAmountPolicy = await verifyPaymentAndCreatePolicy('N/A_PAYMENT_ID', 'N/A_ORDER_ID', 'N/A_SIGNATURE');
        navigate('/confirmation', {
          state: {
            policy: zeroAmountPolicy,
            paymentStatus: 'success',
          },
        });
      } catch (error) {
        console.error('Error with zero amount policy creation:', error);
        alert(`Policy creation failed: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    console.log("isScriptLoaded state:", isScriptLoaded); // NEW LOG: Check script loaded status
    if (!isScriptLoaded || !window.Razorpay) {
      alert('Payment SDK not loaded. Please try again in a moment.');
      setIsLoading(false);
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_APP_BACKEND_URL is not defined!');
        alert('Backend URL is not configured. Please contact support.');
        setIsLoading(false);
        return;
      }

      console.log("Attempting to create order with amount:", finalAmount);
      const orderResponse = await fetch(`${backendUrl}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Error response from create-order:", errorData);
        throw new Error(errorData.message || 'Failed to create order on backend.');
      }

      const orderData = await orderResponse.json();
      console.log("Razorpay Order Data from Backend:", orderData);

      const options = {
        key: 'rzp_live_yYGWUPovOauhOx',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Kalyan EnterPrises',
        description: 'Policy Purchase',
        order_id: orderData.id,
        prefill: {
          name: currentPolicy.customerName,
          email: currentPolicy.email || 'customer@example.com',
          contact: currentPolicy.phoneNumber,
        },
        theme: {
          color: '#528FF0',
        },
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
                errorMessage: 'Payment cancelled by user.',
              },
            });
          },
        },
      };

      console.log("Razorpay Options being sent:", options);
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
```
You're right, the screenshot indicates that the Razorpay popup is actually showing, but it's not responding. This is a subtle but important distinction. The stylesheet error and the absence of our custom `console.log` messages for `handlePayment` indicate that the **`handlePayment` function itself is not being fully executed** or is being blocked.

The most likely culprit is the `disabled` attribute on the "Pay" button: `disabled={isLoading || !isScriptLoaded}`. If `isScriptLoaded` remains `false`, the button will be disabled, preventing `handlePayment` from running.

We need to confirm whether the Razorpay script (`https://checkout.razorpay.com/v1/checkout.js`) is actually loading and setting `isScriptLoaded` to `true`.

---

### **Action for you: Please perform the following steps carefully to get the new debug logs.**

I've already provided the updated `Payment.jsx` with additional `console.log` statements to specifically track the script loading (in the `useEffect`).

1.  **Ensure your `src/pages/user/Payment.jsx` file is updated** with the code from the immersive I just provided (title: "Updated Payment.jsx (Script Loading Debug)").
2.  **Commit and push this change to your frontend GitHub repository.** Vercel will trigger a new deployment.

    * **Git Commands:**
        ```bash
        cd "D:/Documents/Tech EX Yash/IT Clients/Kalyan Enterprises - Car Workshop/RSA/rsa-frontend-app"
        git add src/pages/user/Payment.jsx
        git commit -m "Frontend: Added Razorpay script loading debug logs to Payment.jsx"
        git push origin main
        ```
3.  **Wait for the Vercel deployment to be "Ready" or "Complete."**

4.  **Once deployed, open your Vercel-deployed frontend in a brand new Incognito/Private window.**
5.  Navigate through: `Select Policy` (choose the ₹1 Standard Coverage) -> `Customer Details` (fill in all fields with valid test data) -> `Payment` page.
6.  **Open your browser's Developer Tools (`F12` or Right-click -> "Inspect").** Go to the **"Console" tab.**

**Now, please report the exact output you see in the "Console" tab, paying close attention to these new logs:**

* `"Attempting to load Razorpay script..."`
* `"Razorpay script loaded successfully!"`
* `"Razorpay script failed to load!"` (If this appears, please copy any associated error message).
* `"isScriptLoaded state:"` (What value does this show?)
* `"handlePayment function triggered."` (Does this appear after you click "Pay"?)

Also, if you click the "Pay" button, still try to look for the `POST /create-order` request in the **Network tab** and provide its **Status Code** and **Response** body.

This information is crucial to understand if the script is failing to load, preventing the button from being enabled, or if something else is going wrong even after `handlePayment` is call