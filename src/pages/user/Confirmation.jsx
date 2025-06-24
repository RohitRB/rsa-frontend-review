// src/pages/Confirmation.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { CheckCircle, XCircle, Mail, Phone, Home, Car, User, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, addYears } from 'date-fns';
import emailjs from '@emailjs/browser';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailSendingError, setEmailSendingError] = useState('');
  const [showEmailStatus, setShowEmailStatus] = useState(false); // <--- CRITICAL FIX: Declare this state variable
  const emailSendAttemptedRef = useRef(false);

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
      
      const customerParams = {
        customerName: policy.customerName || 'Customer',
        policyType: policy.policyType || 'RSA Policy',
        policyId: policy.policyNumber || policy.id || 'N/A',
        expiryDate: formattedExpiryDate,
        amount: totalAmount ? totalAmount.toFixed(2) : '0.00',
        email: policy.email,
      };

      try {
        await emailjs.send(serviceId, customerTemplateId, customerParams, publicKey);
        console.log('✅ Customer Email sent successfully!');
        setIsEmailSent(true);
        setEmailSendingError('');
      } catch (err) {
        console.error('❌ Failed to send customer email:', err);
        setIsEmailSent(false);
        setEmailSendingError(`Error sending customer email: ${err.text || err.message || 'Unknown error'}`);
      }

      const adminParams = {
        customerName: policy.customerName || 'Customer',
        policyType: policy.policyType || 'RSA Policy',
        policyId: policy.policyNumber || policy.id || 'N/A',
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

  const generatePDF = () => {
    if (!policy) {
      alert('Policy data not available to generate PDF.');
      return;
    }

    const doc = new jsPDF();
    const totalAmount = parseFloat(policy.amount); 
    const startDatePdf = policy.startDate ? format(new Date(policy.startDate), 'dd/MM/yyyy') : 'N/A';
    const expiryDatePdf = getFormattedExpiryDate(policy);
    const amountInWords = convertToWords(totalAmount);

    const invoiceTitle = policy.policyType || 'RSA Policy Invoice';
    const companyName = 'Kalyan Enterprises';

    doc.setFillColor(0, 51, 153);
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.rect(10, 10, 190, 10, 'F');
    doc.text(companyName, doc.internal.pageSize.getWidth() / 2, 17, { align: 'center' });

    doc.setFontSize(13);
    doc.rect(10, 22, 190, 10, 'F');
    doc.text(invoiceTitle, doc.internal.pageSize.getWidth() / 2, 29, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(0);

    doc.autoTable({
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['Certificate Start Date', 'Certificate End Date', 'Vehicle Registration Number']],
      body: [[startDatePdf, expiryDatePdf, policy.vehicleNumber || 'N/A']],
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [['PERSONAL DETAILS']],
      theme: 'grid',
      styles: { fillColor: [0, 51, 153], textColor: 255, halign: 'left', fontStyle: 'bold' },
      headStyles: { fontSize: 12 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ['Customer Name', policy.customerName || 'N/A'],
        ['Mobile No', policy.phoneNumber && policy.phoneNumber.trim() !== '' ? policy.phoneNumber : 'Not Available'],
        ['Email', policy.email || 'NA'],
        ['Address', `${policy.address || 'N/A'}, ${policy.city || 'N/A'}`]
      ]
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [['PAYMENT DETAILS']],
      theme: 'grid',
      styles: { fillColor: [0, 51, 153], textColor: 255, halign: 'left', fontStyle: 'bold' },
      headStyles: { fontSize: 12 }
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ['Plan Amount', `₹${totalAmount.toFixed(2)}`],
        ['Total Amount Paid', `₹${totalAmount.toFixed(2)}`],
        ['Amount In Words', amountInWords]
      ]
    });

    const policyFeaturesForPdf = [
      ['1', '24/7 Roadside Assistance', 'Yes'],
      ['2', 'Nation Wide Towing', 'Yes'],
      ['3', 'Flat Tire Assistance', 'Yes'],
      ['4', 'Fuel Delivery', 'Yes'],
      ['5', 'Battery Jump Start', 'Yes'],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [['S.No', 'Service Features', 'Included']],
      body: policyFeaturesForPdf,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
    });

    doc.setFont(undefined, 'italic');
    doc.setFontSize(10);
    doc.text(
      'Note: This is a computer-generated policy document and does not require a signature.',
      20,
      doc.lastAutoTable.finalY + 15
    );

    doc.save(`Policy_${policy.policyNumber || policy.id}.pdf`);
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
              <div><p className="text-gray-600 text-sm">Policy Number:</p><p className="font-semibold">{policy.policyNumber || policy.id}</p></div>
              <div><p className="text-gray-600 text-sm">Policy Type:</p><p className="font-semibold">{policy.policyType}</p></div>
              <div><p className="text-gray-600 text-sm">Customer Name:</p><p className="font-semibold">{policy.customerName || 'N/A'}</p></div>
              <div><p className="text-gray-600 text-sm">Vehicle Number:</p><p className="font-semibold">{policy.vehicleNumber || 'N/A'}</p></div>
              <div><p className="text-gray-600 text-sm">Valid Until:</p><p className="font-semibold">{getFormattedExpiryDate(policy)}</p></div>
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
                onClick={generatePDF}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Policy
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
