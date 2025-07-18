// src/pages/Confirmation.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { CheckCircle, XCircle, Mail, Phone, Home, Car, User, Download } from 'lucide-react';
import { format, addYears, addDays } from 'date-fns';
import emailjs from '@emailjs/browser';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailSendingError, setEmailSendingError] = useState('');
  const [showEmailStatus, setShowEmailStatus] = useState(false);
  const emailSendAttemptedRef = useRef(false);
  const [downloading, setDownloading] = useState(false);

  // Helper function to convert amount to words
  const convertToWords = (amount) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
      'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
      'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (num) => {
      if (typeof num !== 'number' || isNaN(num) || num < 0) return 'Invalid Amount';
      num = Math.floor(num);
      if (num === 0) return 'Zero Only';
      if (num.toString().length > 9) return 'Overflow';

      let n = ('000000000' + num).substr(-9).match(/.{1,2}/g);
      if (!n) return '';
      let str = '';
      str += n[0] != 0 ? (a[Number(n[0])] || b[n[0][0]] + ' ' + a[n[0][1]]) + ' Crore ' : '';
      str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Lakh ' : '';
      str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Thousand ' : '';
      str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Hundred ' : '';
      str += n[4] != 0 ? ((str != '') ? 'and ' : '') + (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' ' : '';
      return str.trim() + ' Only';
    };
    return inWords(amount);
  };

  // New direct PDF generation function
  const generatePolicyPDF = (policyData) => {
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFillColor(0, 51, 153);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('RSA Policy Certificate', 105, 12, { align: 'center' });
    
    // Reset text color and add policy details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    const startDate = policyData.startDate ? format(new Date(policyData.startDate), 'dd/MM/yyyy') : 'N/A';
    const expiryDate = policyData.expiryDate ? format(new Date(policyData.expiryDate), 'dd/MM/yyyy') : 'N/A';
    const createdDate = policyData.createdAt ? format(new Date(policyData.createdAt), 'dd/MM/yyyy') : 'N/A';
    
    // Add 30 days to startDate and expiryDate for the PDF
    const startDateObj = policyData.startDate ? new Date(policyData.startDate) : null;
    const expiryDateObj = policyData.expiryDate ? new Date(policyData.expiryDate) : null;
    const startDatePlus30 = startDateObj ? format(addDays(startDateObj, 30), 'dd/MM/yyyy') : 'N/A';
    const expiryDatePlus30 = expiryDateObj ? format(addDays(expiryDateObj, 30), 'dd/MM/yyyy') : 'N/A';
    // Certificate Table
    doc.autoTable({
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['Certificate Start Date (+30d)', 'Certificate End Date (+30d)', 'Vehicle Registration Number']],
      body: [[startDatePlus30, expiryDatePlus30, policyData.vehicleNumber || 'N/A']],
      headStyles: { fillColor: [26, 188, 156], textColor: 255, fontStyle: 'bold' },
    });
    
    // Personal Details
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 6,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['PERSONAL DETAILS','']],
      body: [
        ['Customer Name', policyData.customerName || 'N/A'],
        ['Mobile No', policyData.phoneNumber || 'N/A'],
        ['Email', policyData.email || 'N/A'],
        ['Address', `${policyData.address || 'N/A'}, ${policyData.city || 'N/A'}`],
      ],
      headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    });
    
    // Payment Details
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 6,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['PAYMENT DETAILS','']],
      body: [
        ['Plan Amount', policyData.amount ? `₹${policyData.amount.toFixed(2)}` : 'N/A'],
        ['Total Amount Paid', policyData.amount ? `₹${policyData.amount.toFixed(2)}` : 'N/A'],
        ['Amount In Words', convertToWords(policyData.amount || 0)],
      ],
      headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    });
    
    // Features
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 6,
      head: [['S.No', 'Service Features', 'Included']],
      body: [
        ['1', '24/7 Roadside Assistance', 'Yes'],
        ['2', 'Nation Wide Towing', 'Yes'],
        ['3', 'Flat Tire Assistance', 'Yes'],
        ['4', 'Fuel Delivery', 'Yes'],
        ['5', 'Battery Jump Start', 'Yes']
      ],
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 }
    });
    
    doc.setFont(undefined, 'italic');
    doc.setFontSize(10);
    doc.text(
      'Note: This is a computer-generated policy document and does not require a signature.',
      20,
      doc.lastAutoTable.finalY + 15
    );
    
    const policyIdentifier = policyData.policyId || policyData.policyNumber || policyData.id;
    doc.save(`Policy_${policyIdentifier}.pdf`);
  };

  // Function to generate PDF as blob for email attachments
  const generatePolicyPDFAsBlob = (policyData) => {
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFillColor(0, 51, 153);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('RSA Policy Certificate', 105, 12, { align: 'center' });
    
    // Reset text color and add policy details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    const startDate = policyData.startDate ? format(new Date(policyData.startDate), 'dd/MM/yyyy') : 'N/A';
    const expiryDate = policyData.expiryDate ? format(new Date(policyData.expiryDate), 'dd/MM/yyyy') : 'N/A';
    const createdDate = policyData.createdAt ? format(new Date(policyData.createdAt), 'dd/MM/yyyy') : 'N/A';
    
    // Certificate Table
    doc.autoTable({
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['Certificate Start Date', 'Certificate End Date', 'Vehicle Registration Number']],
      body: [[startDate, expiryDate, policyData.vehicleNumber || 'N/A']],
      headStyles: { fillColor: [26, 188, 156], textColor: 255, fontStyle: 'bold' },
    });
    
    // Personal Details
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 6,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['PERSONAL DETAILS']],
      body: [
        ['Customer Name', policyData.customerName || 'N/A'],
        ['Mobile No', policyData.phoneNumber || 'N/A'],
        ['Email', policyData.email || 'N/A'],
        ['Address', `${policyData.address || 'N/A'}, ${policyData.city || 'N/A'}`],
      ],
      headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    });
    
    // Payment Details
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 6,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['PAYMENT DETAILS']],
      body: [
        ['Plan Amount', policyData.amount ? `₹${policyData.amount.toFixed(2)}` : 'N/A'],
        ['Total Amount Paid', policyData.amount ? `₹${policyData.amount.toFixed(2)}` : 'N/A'],
        ['Amount In Words', convertToWords(policyData.amount || 0)],
      ],
      headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    });
    
    // Features
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 6,
      head: [['S.No', 'Service Features', 'Included']],
      body: [
        ['1', '24/7 Roadside Assistance', 'Yes'],
        ['2', 'Nation Wide Towing', 'Yes'],
        ['3', 'Flat Tire Assistance', 'Yes'],
        ['4', 'Fuel Delivery', 'Yes'],
        ['5', 'Battery Jump Start', 'Yes']
      ],
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 }
    });
    
    doc.setFont(undefined, 'italic');
    doc.setFontSize(10);
    doc.text(
      'Note: This is a computer-generated policy document and does not require a signature.',
      20,
      doc.lastAutoTable.finalY + 15
    );
    
    // Convert PDF to blob
    const pdfOutput = doc.output('blob');
    return new Blob([pdfOutput], { type: 'application/pdf' });
  };

  useEffect(() => {
    const navState = location.state;
    if (navState?.policy) {
      setPolicy(navState.policy);
      setPaymentStatus(navState.paymentStatus || 'pending');
      setErrorMessage(navState.errorMessage || '');
      localStorage.setItem('lastConfirmedPolicy', JSON.stringify({
        ...navState.policy,
        startDate: navState.policy.startDate instanceof Date ? navState.policy.startDate.toISOString() : navState.policy.startDate,
        expiryDate: navState.policy.expiryDate instanceof Date ? navState.policy.expiryDate.toISOString() : navState.policy.expiryDate,
        createdAt: navState.policy.createdAt instanceof Date ? navState.policy.createdAt.toISOString() : navState.policy.createdAt,
      }));
      localStorage.setItem('lastPaymentStatus', navState.paymentStatus || 'pending');
      localStorage.setItem('lastErrorMessage', navState.errorMessage || '');
    } else {
      const storedPolicyJson = localStorage.getItem('lastConfirmedPolicy');
      const storedPaymentStatus = localStorage.getItem('lastPaymentStatus');
      const storedErrorMessage = localStorage.getItem('lastErrorMessage');

      if (storedPolicyJson) {
        const storedPolicy = JSON.parse(storedPolicyJson);
        storedPolicy.startDate = storedPolicy.startDate ? new Date(storedPolicy.startDate) : null;
        storedPolicy.expiryDate = storedPolicy.expiryDate ? new Date(storedPolicy.expiryDate) : null;
        storedPolicy.createdAt = storedPolicy.createdAt ? new Date(storedPolicy.createdAt) : null;

        setPolicy(storedPolicy);
        setPaymentStatus(storedPaymentStatus || 'success');
        setErrorMessage(storedErrorMessage || '');
      } else {
        console.warn("No policy data found in location state or local storage. Redirecting to home.");
        navigate('/');
      }
    }
  }, [location.state, navigate]);

  const getFormattedExpiryDate = (policyObj) => {
    if (!policyObj?.expiryDate) return 'N/A';
    const date = policyObj.expiryDate instanceof Date ? policyObj.expiryDate : new Date(policyObj.expiryDate);
    return format(date, 'dd/MM/yyyy');
  };

  // Helper to add 30 days to expiry date
  const getFormattedExpiryDatePlus30 = (policyObj) => {
    if (!policyObj?.expiryDate) return 'N/A';
    const date = policyObj.expiryDate instanceof Date ? policyObj.expiryDate : new Date(policyObj.expiryDate);
    const plus30 = addDays(date, 30);
    return format(plus30, 'dd/MM/yyyy');
  };

  useEffect(() => {
    if (!policy || emailSendAttemptedRef.current || paymentStatus !== 'success') {
      return;
    }

    const sendConfirmationEmails = async () => {
      emailSendAttemptedRef.current = true;

      const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
      const customerTemplateId = import.meta.env.VITE_APP_EMAILJS_CUSTOMER_TEMPLATE_ID;
      const adminTemplateId = import.meta.env.VITE_APP_EMAILJS_ADMIN_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_APP_EMAILJS_USER_ID;

      if (!serviceId || !customerTemplateId || !adminTemplateId || !publicKey || publicKey === 'your_emailjs_user_id') {
        console.warn("EmailJS environment variables are not fully configured. Email sending will not work.");
        setEmailSendingError("Email service is not configured correctly. Please contact support.");
        setShowEmailStatus(true);
        return;
      }

      const totalAmount = parseFloat(policy.amount);
      const formattedExpiryDate = getFormattedExpiryDate(policy);

      if (!policy.email || policy.email.trim() === '' || policy.email === 'NA' || policy.email === 'undefined') {
        console.warn("Cannot send email: Customer email is missing or invalid.");
        setEmailSendingError("Customer email address is missing or invalid. Email not sent.");
        setIsEmailSent(false);
        setShowEmailStatus(true);
        return;
      }

      // Fetch fresh policy data from API for PDF generation and email
      let policyForPDF = null;
      try {
        const policyId = policy.policyId || policy.policyNumber || policy.id;
        const freshPolicyData = await fetchPolicyForPDF(policyId);
        if (!freshPolicyData) {
          setEmailSendingError('Failed to fetch policy data from server. Email not sent.');
          setIsEmailSent(false);
          setShowEmailStatus(true);
          return;
        }
        policyForPDF = freshPolicyData;
      } catch (error) {
        setEmailSendingError('Error fetching policy data from server. Email not sent.');
        setIsEmailSent(false);
        setShowEmailStatus(true);
        return;
      }

      // Generate PDF for attachment
      let pdfBlob = null;
      try {
        // When calling generatePolicyPDF or generatePolicyPDFAsBlob, just pass the policy object as received from API or state.
        // The flattening/sanitization is now handled inside pdfUtils.js
        pdfBlob = generatePolicyPDFAsBlob(policyForPDF);
        console.log('PDF generated successfully for email attachment');
      } catch (error) {
        console.error('Error generating PDF for email attachment:', error);
        // Continue without attachment if PDF generation fails
      }

      const customerParams = {
        customerName: policyForPDF.customerName || 'Customer',
        policyType: policyForPDF.policyType || 'RSA Policy',
        policyId: policyForPDF.policyId || policyForPDF.policyNumber || policyForPDF.id || 'N/A',
        expiryDate: formattedExpiryDate,
        amount: totalAmount ? totalAmount.toFixed(2) : '0.00',
        email: policyForPDF.email,
      };

      try {
        // Send customer email with PDF attachment if available
        if (pdfBlob) {
          await emailjs.send(serviceId, customerTemplateId, customerParams, publicKey, {
            attachment: {
              name: `Policy_${policyForPDF.policyId || policyForPDF.policyNumber || policyForPDF.id}.pdf`,
              data: pdfBlob
            }
          });
        } else {
          await emailjs.send(serviceId, customerTemplateId, customerParams, publicKey);
        }
        console.log('✅ Customer Email sent successfully!');
        setIsEmailSent(true);
        setEmailSendingError('');
      } catch (err) {
        console.error('❌ Failed to send customer email:', err);
        setIsEmailSent(false);
        setEmailSendingError(`Error sending customer email: ${err.text || err.message || 'Unknown error'}`);
      }

      const adminParams = {
        customerName: policyForPDF.customerName || 'Customer',
        policyType: policyForPDF.policyType || 'RSA Policy',
        policyId: policyForPDF.policyId || policyForPDF.policyNumber || policyForPDF.id || 'N/A',
        expiryDate: formattedExpiryDate,
        amount: totalAmount ? totalAmount.toFixed(2) : '0.00',
      };

      try {
        await emailjs.send(serviceId, adminTemplateId, adminParams, publicKey);
        console.log('✅ Admin Email sent successfully!');
      } catch (err) {
        console.error('❌ Failed to send admin email:', err);
      }

      setShowEmailStatus(true);
    };

    sendConfirmationEmails();
  }, [policy, paymentStatus]);

  // Function to fetch policy data from API for PDF generation
  const fetchPolicyForPDF = async (policyId) => {
    try {
      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/policies/${policyId}`, { cache: 'no-store' });
      
      if (response.ok) {
        const policyData = await response.json();
        console.log('Fetched policy data from API:', policyData);
        return policyData;
      } else {
        console.error('Failed to fetch policy data from API:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching policy data:', error);
      return null;
    }
  };

  // Revert to original: use in-memory policy data for PDF download
  const handleDownloadPDF = () => {
    if (!policy) {
      alert('Policy data not available to generate PDF.');
      return;
    }
    generatePolicyPDF(policy);
  };

  if (!policy) return null;

  const isSuccess = paymentStatus === 'success';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            )}
          </div>

          <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-gray-800' : 'text-red-800'}`}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed / Cancelled'}
          </h1>
          <p className={`${isSuccess ? 'text-green-600' : 'text-red-600'} font-semibold mb-6`}>
            {isSuccess ? 'Your RSA policy has been activated' : errorMessage || 'Please try again or contact support.'}
          </p>

          {/* Policy Activation Notice */}
          {isSuccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      <strong>Your policy will be active after 30 days from the date of purchase.</strong> 
                      During this period, your policy is being processed and will be fully functional from{' '}
                      {policy.purchaseDate || policy.createdAt
                        ? format(
                            addDays(new Date(policy.purchaseDate || policy.createdAt), 30),
                            'dd MMMM yyyy'
                          )
                        : 'the activation date'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEmailStatus && (
            <div className={`mt-4 p-3 rounded-md mx-auto max-w-sm ${isEmailSent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isEmailSent ? (
                <p className="flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" /> Email Sent Successfully!
                </p>
              ) : (
                <p className="flex items-center justify-center">
                  <XCircle className="w-5 h-5 mr-2" /> Failed to send email: {emailSendingError}
                </p>
              )}
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Policy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-gray-600 text-sm">Policy Number:</p><p className="font-semibold">{policy.policyId || policy.policyNumber || policy.id}</p></div>
              <div><p className="text-gray-600 text-sm">Policy Type:</p><p className="font-semibold">{policy.policyType || 'RSA Policy'}</p></div>
              <div><p className="text-gray-600 text-sm">Customer Name:</p><p className="font-semibold">{policy.customerName || 'N/A'}</p></div>
              <div><p className="text-gray-600 text-sm">Vehicle Number:</p><p className="font-semibold">{policy.vehicleNumber || 'N/A'}</p></div>
              <div><p className="text-gray-600 text-sm">Valid Until:</p><p className="font-semibold">{getFormattedExpiryDatePlus30(policy)}</p></div>
              <div><p className="text-gray-600 text-sm">Amount Paid:</p><p className="font-semibold">₹{policy.amount ? policy.amount.toLocaleString() : '0'}</p></div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">How to use your RSA service</h2>
            <p className="mb-2">In case of emergency, call our 24/7 helpline:</p>
            <div className="bg-blue-600 text-white p-4 rounded-md flex items-center justify-center space-x-2">
              <Phone className="h-5 w-5" />
              <span className="text-xl font-bold">+91 8398912131</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            {isSuccess && (
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="mr-2 h-5 w-5" /> Download Policy
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
