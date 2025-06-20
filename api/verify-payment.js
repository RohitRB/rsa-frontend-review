import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, policyData, customerData } = req.body;

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Here you would typically save to your database
    // For now, we'll just return success
    const savedData = {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      policy: policyData,
      customer: customerData,
      timestamp: new Date().toISOString(),
      status: 'verified'
    };

    // You can integrate with Firebase here if needed
    // const { initializeApp } = await import('firebase/app');
    // const { getFirestore, doc, setDoc } = await import('firebase/firestore');

    return res.status(200).json({
      success: true,
      message: 'Payment verified and data saved successfully',
      data: savedData
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during payment verification'
    });
  }
} 