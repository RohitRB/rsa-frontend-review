import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePolicy } from '../../context/PolicyContext';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { Check, Download, Phone, XCircle } from 'lucide-react'; // Added XCircle for failure
import { format, addYears, addDays } from 'date-fns';
import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this is correctly imported and handled

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateCustomerDetails } = usePolicy(); // Keep this if you need to update customer details outside payment flow
  const [policy, setPolicy] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'success', 'fail', 'pending'
  const [errorMessage, setErrorMessage] = useState('');
  const emailSentRef = useRef(false); // To prevent multiple email sends

  useEffect(() => {
    // Get policy and payment status from navigation state
    const navState = location.state;
    if (navState?.policy) {
      setPolicy(navState.policy);
      setPaymentStatus(navState.paymentStatus || 'pending');
      setErrorMessage(navState.errorMessage || '');
      localStorage.setItem('lastConfirmedPolicy', JSON.stringify(navState.policy));
    } else {
      // If direct access or refresh, try to load from local storage
      const storedPolicy = JSON.parse(localStorage.getItem('lastConfirmedPolicy'));
      if (storedPolicy) {
        setPolicy(storedPolicy);
        // If loaded from storage, assume success for display purposes
        // In a real app, you might re-verify with backend here
        setPaymentStatus('success');
      } else {
        navigate('/'); // Redirect if no policy data is found
      }
    }
  }, [location.state, navigate]);

  // Calculate expiry date based on policy duration
  const getExpiryDate = (policyObj) => {
    if (!policyObj || !policyObj.duration) return 'N/A';
    const durationYears = parseInt(policyObj.duration.split(' ')[0]) || 1;
    const startDate = policyObj.startDate ? new Date(policyObj.startDate) : new Date();
    const calculatedExpiryDate = addYears(startDate, durationYears);
    return format(calculatedExpiryDate, 'dd/MM/yyyy');
  };

  // --- START: Email Sending Logic ---
  useEffect(() => {
    if (!policy || emailSentRef.current || paymentStatus !== 'success') {
      return; // Only send email if policy exists, not already sent, and payment was successful
    }

    // Initialize EmailJS (ensure your .env variables or direct credentials are set correctly)
    // emailjs.init('YOUR_PUBLIC_KEY'); // You might need to initialize it globally or here if not done already

    const sendEmails = async () => {
      // Note: Policy.amount should already be the final amount. Remove local GST calc.
      const totalAmount = policy.amount; // Use policy.amount directly

      const currentExpiryDate = getExpiryDate(policy);

      // Email to Customer
      const customerParams = {
        customerName: policy.customerName,
        policyType: policy.policyType,
        policyId: policy.policyNumber, // Use the unique policyNumber
        expiryDate: currentExpiryDate,
        amount: totalAmount,
        email: policy.email,
      };

      try {
        await emailjs.send('service_jxfnu9e', 'template_6nqqa86', customerParams, 'KjdPUWClLtvszArtz');
        console.log('✅ Customer Email sent!');
        // Consider showing a subtle "Email sent!" message to the user on the page
      } catch (err) {
        console.error('❌ Failed to send customer email:', err);
      }

      // Email to Admin
      const adminParams = {
        customerName: policy.customerName,
        policyType: policy.policyType,
        policyId: policy.policyNumber, // Use the unique policyNumber
        expiryDate: currentExpiryDate,
        amount: totalAmount,
      };

      try {
        await emailjs.send('service_jxfnu9e', 'template_ke8iorl', adminParams, 'KjdPUWClLtvszArtz');
        console.log('✅ Admin Email sent!');
      } catch (err) {
        console.error('❌ Failed to send admin email:', err);
      }

      emailSentRef.current = true; // Mark email as sent
    };

    sendEmails();
  }, [policy, paymentStatus]);
  // --- END: Email Sending Logic ---

  // Function to convert number to words for PDF
  const convertToWords = (amount) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
      'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
      'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (num) => {
      if ((num = num.toString()).length > 9) return 'Overflow';
      let n = ('000000000' + num).substr(-9).match(/.{1,2}/g);
      if (!n) return '';
      let str = '';
      str += n[0] != 0 ? (a[Number(n[0])] || b[n[0][0]] + ' ' + a[n[0][1]]) + ' Crore ' : '';
      str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Lakh ' : '';
      str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Thousand ' : '';
      str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Hundred ' : '';
      str += n[4] != 0 ? ((str != '') ? 'and ' : '') + (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' ' : '';
      return str.trim() + ' Only'; // Trim and add " Only"
    };

    return inWords(amount);
  };

  // --- START: PDF Generation Logic ---
  const generatePDF = () => {
    if (!policy) {
      alert('Policy data not available to generate PDF.');
      return;
    }

    const doc = new jsPDF();
    // These amounts should come directly from policy.amount as it's inclusive
    const totalAmount = policy.amount;
    // If you *must* show a breakdown, calculate tax based on price excluding tax
    // For now, assuming policy.amount IS the total including tax.
    const taxAmount = 0; // Assuming 0 as price is inclusive. Adjust if breakdown is needed.

    // Dates from the policy object
    const startDatePdf = policy.startDate ? format(new Date(policy.startDate), 'dd/MM/yyyy') : 'N/A';
    const expiryDatePdf = policy.expiryDate ? format(new Date(policy.expiryDate), 'dd/MM/yyyy') : getExpiryDate(policy);


    const amountInWords = convertToWords(Math.round(totalAmount));

    const invoiceTitle = policy.policyType || 'RSA Policy Invoice'; // More specific title
    const companyName = 'Kalyan Enterprises'; // Hardcode if consistent
    const supportNumber = '+91 8398912131'; // Hardcode if consistent

    // Header
    doc.setFillColor(0, 51, 153); // Dark blue
    doc.setTextColor(255); // White text
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.rect(10, 10, 190, 10, 'F');
    doc.text(companyName, doc.internal.pageSize.getWidth() / 2, 17, { align: 'center' }); // Center company name

    doc.setFontSize(13);
    doc.rect(10, 22, 190, 10, 'F');
    doc.text(invoiceTitle, doc.internal.pageSize.getWidth() / 2, 29, { align: 'center' }); // Center invoice title

    doc.setFontSize(11);
    doc.setTextColor(0); // Black text for content

    // Certificate Dates and Vehicle No
    autoTable(doc, {
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['Certificate Start Date', 'Certificate End Date', 'Vehicle Registration Number']],
      body: [[startDatePdf, expiryDatePdf, policy.vehicleNumber]],
    });

    // Personal Details Header
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      head: [['PERSONAL DETAILS']],
      theme: 'grid',
      styles: { fillColor: [0, 51, 153], textColor: 255, halign: 'left', fontStyle: 'bold' },
      headStyles: { fontSize: 12 }
    });

    // Personal Details Body
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ['Customer Name', policy.customerName], // Changed from First Name
        ['Mobile No', policy.phoneNumber && policy.phoneNumber.trim() !== '' ? policy.phoneNumber : 'Not Available'],
        ['Email', policy.email || 'NA'],
        ['Address', `${policy.address}, ${policy.city}` || 'NA'] // Combine address and city
      ]
    });

    // Payment Details Header
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      head: [['PAYMENT DETAILS']],
      theme: 'grid',
      styles: { fillColor: [0, 51, 153], textColor: 255, halign: 'left', fontStyle: 'bold' },
      headStyles: { fontSize: 12 }
    });

    // Payment Details Body
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ['Plan Amount', `₹${totalAmount.toFixed(2)}`], // Use totalAmount directly
        // If you need a tax breakdown:
        // ['Amount Of Tax IGST (18%)', `₹${taxAmount.toFixed(2)}`],
        ['Total Amount Paid', `₹${totalAmount.toFixed(2)}`], // Clarify it's total paid
        ['Amount In Words', amountInWords]
      ]
    });

    // Plan Features (consider making this dynamic based on policy.features if possible)
    // For now, using a placeholder if policy.features is not formatted for autoTable body directly
    const policyFeaturesForPdf = policy.features ? policy.features.map((f, idx) => [idx + 1, f.name, f.included ? 'Yes' : 'No']) : [
      ['1', '24/7 Roadside Assistance', 'Yes'],
      ['2', 'Nation Wide Towing', 'Yes'],
      ['3', 'Flat Tire Assistance', 'Yes'],
      ['4', 'Fuel Delivery', 'Yes'],
      ['5', 'Battery Jump Start', 'Yes'],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      head: [['S.No', 'Service Features', 'Included']], // Renamed PPEY to Included for clarity
      body: policyFeaturesForPdf,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
    });

    doc.setFont(undefined, 'italic');
    doc.setFontSize(10);
    doc.text(
      'Note: This is a computer-generated policy document and does not require a signature.', // More accurate note
      20,
      doc.lastAutoTable.finalY + 15
    );

    doc.save(`Policy_${policy.policyNumber || policy.id}.pdf`); // Use unique policyNumber for filename
  };
  // --- END: PDF Generation Logic ---


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
                <Check className="h-10 w-10 text-green-600" />
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

          {isSuccess && (
            <div className="bg-blue-50 p-4 rounded-md mb-8">
              <h2 className="text-lg font-semibold mb-2">Email Sent Successfully!</h2>
              <p className="text-gray-700">
                A confirmation email with your policy details has been sent to{' '}
                <span className="font-semibold">{policy.email}</span>
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Policy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fix 2: Display policy.policyNumber instead of policy.id */}
              <div><p className="text-gray-600 text-sm">Policy Number:</p><p className="font-semibold">{policy.policyNumber || policy.id}</p></div>
              <div><p className="text-gray-600 text-sm">Policy Type:</p><p className="font-semibold">{policy.policyType}</p></div>
              <div><p className="text-gray-600 text-sm">Customer Name:</p><p className="font-semibold">{policy.customerName}</p></div>
              <div><p className="text-gray-600 text-sm">Vehicle Number:</p><p className="font-semibold">{policy.vehicleNumber}</p></div>
              <div><p className="text-gray-600 text-sm">Valid Until:</p><p className="font-semibold">{getExpiryDate(policy)}</p></div>
              {/* Fix 3: Display policy.amount directly, remove local GST calc */}
              <div><p className="text-gray-600 text-sm">Amount Paid:</p><p className="font-semibold">₹{policy.amount}</p></div>
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
            {isSuccess && ( // Only show download button on success
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
