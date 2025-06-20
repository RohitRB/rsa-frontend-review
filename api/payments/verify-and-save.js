import crypto from 'crypto';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      policyData, 
      customerData 
    } = req.body;

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment signature' 
      });
    }

    // Initialize Firebase
    const firebaseConfigString = process.env.VITE_APP_FIREBASE_CONFIG;
    if (!firebaseConfigString) {
      return res.status(500).json({
        success: false,
        message: 'Firebase configuration not found'
      });
    }

    let firebaseConfig;
    try {
      firebaseConfig = JSON.parse(firebaseConfigString);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Invalid Firebase configuration'
      });
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Save customer data to Firestore
    const customerRef = await addDoc(collection(db, 'customers'), {
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save policy data to Firestore
    const policyRef = await addDoc(collection(db, 'policies'), {
      ...policyData,
      customerId: customerRef.id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified and data saved successfully',
      policyId: policyRef.id,
      customerId: customerRef.id,
      data: {
        policy: { id: policyRef.id, ...policyData },
        customer: { id: customerRef.id, ...customerData }
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during payment verification',
      error: error.message
    });
  }
} 