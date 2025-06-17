import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; // Assuming Header exists
import Stepper from '../../components/Stepper'; // Assuming Stepper exists
import { CheckCircle, XCircle, Mail, Phone, Home, Car, User } from 'lucide-react'; // Added icons
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For better table generation in PDF
import { format } from 'date-fns'; // For date formatting

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // Can be 'success' or 'fail'
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showEmailStatus, setShowEmailStatus] = useState(false);


  useEffect(() => {
    if (location.state && location.state.policy) {
      setPolicy(location.state.policy);
      setPaymentStatus(location.state.paymentStatus || 'success'); // Default to success if not specified
    } else {
      // If no policy data, redirect to home or policy selection
      console.warn("No policy data found in location state. Redirecting to home.");
      navigate('/');
    }
  }, [location.state, navigate]);

  // Effect to send email after policy is set and payment is successful
  useEffect(() => {
    if (policy && paymentStatus === 'success' && !isEmailSent) {
      sendConfirmationEmail(policy);
    }
  }, [policy, paymentStatus, isEmailSent]);


  const sendConfirmationEmail = async (policyDetails) => {
    // Check if customer email exists
    if (!policyDetails.email) {
      console.warn("Cannot send email: Customer email is missing.");
      setEmailError("Customer email address is missing.");
      setShowEmailStatus(true);
      return;
    }
    
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_APP_BACKEND_URL is not defined for email sending!');
      setEmailError('Backend URL is not configured for email service.');
      setShowEmailStatus(true);
      return;
    }

    try {
      console.log('Attempting to send confirmation email...');
      const response = await fetch(`${backendUrl}/api/confirmations/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: policyDetails }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Customer Email sent successfully!');
        setIsEmailSent(true);
        setEmailError('');
      } else {
        console.error('❌ Failed to send customer email:', data.message);
        setEmailError(data.message || 'Failed to send confirmation email.');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      setEmailError(`Network error or backend issue: ${error.message}`);
    } finally {
      setShowEmailStatus(true); // Always show status after attempt
    }
  };


  const handleDownloadPolicy = async () => {
    if (!policy) {
      console.error("No policy data available for PDF download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("RSA Policy Confirmation", 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);

    // Policy Details Table
    doc.text("Policy Details:", 10, 40);
    doc.autoTable({
      startY: 45,
      head: [['Field', 'Detail']],
      body: [
        ['Policy Number', policy.policyNumber || 'N/A'],
        ['Policy Type', policy.policyType || 'N/A'],
        ['Duration', policy.duration || 'N/A'],
        ['Amount Paid', `₹${policy.amount ? policy.amount.toLocaleString() : '0'}`],
        // Ensure these dates are formatted. The 'policy' object should have Date objects from PolicyContext.
        ['Start Date', policy.startDate ? format(new Date(policy.startDate), 'dd MMMM yyyy') : 'N/A'],
        ['Expiry Date', policy.expiryDate ? format(new Date(policy.expiryDate), 'dd MMMM yyyy') : 'N/A'],
        ['Status', policy.status || 'N/A']
      ],
      theme: 'striped',
      headStyles: { fillColor: '#1e40af' },
      styles: { cellPadding: 3, fontSize: 10, valign: 'middle' },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    // Customer Details Table
    doc.text("Customer Details:", 10, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Field', 'Detail']],
      body: [
        ['Name', policy.customerName || 'N/A'],
        ['Email', policy.email || 'N/A'],
        ['Phone Number', policy.phoneNumber || 'N/A'],
        ['Address', `${policy.address || 'N/A'}, ${policy.city || 'N/A'}`],
        ['Vehicle Number', policy.vehicleNumber || 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: '#10B981' },
      styles: { cellPadding: 3, fontSize: 10, valign: 'middle' },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    // How to use service (static content)
    doc.text("How to use your RSA service:", 10, doc.autoTable.previous.finalY + 10);
    doc.text("In case of emergency, call our 24/7 helpline: +91 8398912131", 10, doc.autoTable.previous.finalY + 20);

    doc.save(`RSA_Policy_${policy.policyNumber || 'Confirmation'}.pdf`);
  };


  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-700 text-lg">Loading policy details or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          {paymentStatus === 'success' ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
              <p className="text-green-600 mb-6">Your RSA policy has been activated</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed!</h1>
              <p className="text-red-600 mb-6">There was an issue processing your payment. Please try again.</p>
            </>
          )}

          {/* Email Sending Status */}
          {showEmailStatus && (
            <div className={`mt-4 p-3 rounded-md mx-auto max-w-sm ${isEmailSent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isEmailSent ? (
                <p className="flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" /> Email Sent Successfully!
                </p>
              ) : (
                <p className="flex items-center justify-center">
                  <XCircle className="w-5 h-5 mr-2" /> Failed to send email: {emailError}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Policy Details */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Policy Details</h2>
              <div className="space-y-2">
                <p><strong className="text-gray-600">Policy Number:</strong> {policy.policyNumber || 'N/A'}</p>
                <p><strong className="text-gray-600">Policy Type:</strong> {policy.policyType || 'N/A'}</p>
                <p><strong className="text-gray-600">Duration:</strong> {policy.duration || 'N/A'}</p>
                <p><strong className="text-gray-600">Amount Paid:</strong> ₹{policy.amount ? policy.amount.toLocaleString() : '0'}</p>
                <p><strong className="text-gray-600">Valid From:</strong> {policy.startDate ? format(new Date(policy.startDate), 'dd/MM/yyyy') : 'N/A'}</p>
                <p><strong className="text-gray-600">Valid Until:</strong> {policy.expiryDate ? format(new Date(policy.expiryDate), 'dd/MM/yyyy') : 'N/A'}</p>
                <p><strong className="text-gray-600">Status:</strong> {policy.status || 'N/A'}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Customer Details</h2>
              <div className="space-y-2">
                <p className="flex items-center"><User className="w-5 h-5 mr-2 text-gray-500" /><strong className="text-gray-600">Name:</strong> {policy.customerName || 'N/A'}</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-2 text-gray-500" /><strong className="text-gray-600">Email:</strong> {policy.email || 'N/A'}</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-2 text-gray-500" /><strong className="text-gray-600">Phone:</strong> {policy.phoneNumber || 'N/A'}</p>
                <p className="flex items-center"><Home className="w-5 h-5 mr-2 text-gray-500" /><strong className="text-gray-600">Address:</strong> {policy.address || 'N/A'}, {policy.city || 'N/A'}</p>
                <p className="flex items-center"><Car className="w-5 h-5 mr-2 text-gray-500" /><strong className="text-gray-600">Vehicle Number:</strong> {policy.vehicleNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-4 rounded-md shadow-sm text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">How to use your RSA service</h2>
            <p className="text-gray-700 mb-4">
              In case of emergency, call our 24/7 helpline:
            </p>
            <a
              href="tel:+918398912131"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Phone className="h-5 w-5 mr-2" /> +91 8398912131
            </a>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDownloadPolicy}
              className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Download Policy
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Admin Dashboard
            </button>
          </div>
      </main>
    </div>
  );
};

export default Confirmation;
