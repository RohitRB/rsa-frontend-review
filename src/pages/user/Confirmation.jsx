import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePolicy } from '../../context/PolicyContext';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { Check, Download, Phone } from 'lucide-react';
import { format, addYears, addDays } from 'date-fns';
import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Confirmation = () => {
   const hasCreatedRef = useRef(false);
  // const [customerId, setCustomerId] = useState(null); // ✅ Define this at top

  const { updateCustomerDetails } = usePolicy();
  const location = useLocation();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(location.state?.policy || null);
  console.log("Policy ", policy);
  useEffect(() => {
    if (!policy) {
      const storedPolicy = JSON.parse(localStorage.getItem('policy'));
      if (storedPolicy) {
        setPolicy(storedPolicy); // <--- async update
      } else {
        navigate('/');
      }
    }
  }, []);


  const expiryYears = policy?.policyType?.toLowerCase().includes('standard')
    ? 1
    : policy?.policyType?.toLowerCase().includes('premium')
      ? 2
      : 3;

  const expiryDate = format(addYears(new Date(), expiryYears), 'dd/M/yyyy');








  // Customer Creation Effect
  useEffect(() => {
    if (!policy || hasCreatedRef.current  ){
      return;
    }

    const createCustomerAndConfirmation = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/customers/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(policy),
        });

        if (!res.ok) throw new Error('Customer creation failed');

        const data = await res.json();
        const customerId = data._id


        const res2 = await fetch('http://localhost:5000/api/confirmations/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policyType: policy.policyType,
            amount: policy.amount,
            expiryDate: format(addYears(new Date(), 1), 'dd/MM/yyyy'), // or use your expiryYears logic
            customerId,
          }),
        });

        if (!res2.ok) throw new Error('Confirmation creation failed');


      } catch (err) {
        console.error('❌ Error creating customer', err);
      }
    };
    createCustomerAndConfirmation();
  }, [policy]);





  useEffect(() => {
    if (!policy || sessionStorage.getItem('emailSent') === 'true') return;

    const sendEmails = () => {
      const totalAmount = policy.amount + Math.round(policy.amount * 0.18);

      // Email to Customer
      const customerParams = {
        customerName: policy.customerName,
        policyType: policy.policyType,
        policyId: policy.id,
        expiryDate,
        amount: totalAmount,
        email: policy.email,
      };

      emailjs
        .send('service_jxfnu9e', 'template_6nqqa86', customerParams, 'KjdPUWClLtvszArtz')
        .then((res) => console.log('✅ Customer Email sent!', res.status, res.text))
        .catch((err) => console.error('❌ Failed to send customer email:', err));

      // Email to Admin
      const adminParams = {
        customerName: policy.customerName,
        policyType: policy.policyType,
        policyId: policy.id,
        expiryDate,
        amount: totalAmount,
      };

      emailjs
        .send('service_jxfnu9e', 'template_ke8iorl', adminParams, 'KjdPUWClLtvszArtz')
        .then((res) => console.log('✅ Admin Email sent!', res.status, res.text))
        .catch((err) => console.error('❌ Failed to send admin email:', err));

      sessionStorage.setItem('emailSent', 'true');
    };

    sendEmails();
  }, [policy, expiryDate]);


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
      return str + 'Only';
    };

    return inWords(amount);
  };

  const generatePDF = () => {
    if (!policy) return;

    const doc = new jsPDF();
    const gstRate = 0.18;
    const taxAmount = +(policy.amount * gstRate).toFixed(2);
    const totalAmount = +(policy.amount + taxAmount).toFixed(2);

    const startDateObj = addDays(today, 30);
    const startDate = format(startDateObj, 'dd/MM/yyyy');

    let durationYears = 3;
    if (policy.policyType?.toLowerCase().includes('standard')) {
      durationYears = 1;
    } else if (policy.policyType?.toLowerCase().includes('premium')) {
      durationYears = 2;
    }

    const endDateObj = addYears(startDateObj, durationYears);
    const endDate = format(endDateObj, 'dd/MM/yyyy');

    const amountInWords = convertToWords(Math.round(totalAmount));

    const invoiceTitle = policy.policyType || 'Tax Invoice';
    const companyName = policy.companyName || 'Kalyan Enterprises';
    const textWidth = doc.getTextWidth(companyName);
    const pageWidth = doc.internal.pageSize.getWidth();
    const xCentered = (pageWidth - textWidth) / 2;
    const supportNumber = policy.supportNumber || '+91 8398912131';

    doc.setFillColor(0, 51, 153);
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.rect(10, 10, 190, 10, 'F');
    doc.text(companyName, xCentered, 17);

    doc.setFontSize(13);
    doc.rect(10, 22, 190, 10, 'F');
    doc.text(invoiceTitle, 85, 29);

    doc.setFontSize(11);
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['Certificate Start Date', 'Certificate End Date', 'Vehicle Registration Number']],
      body: [[startDate, endDate, policy.vehicleNumber]],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      head: [['PERSONAL DETAILS']],
      body: [],
      theme: 'grid',
      styles: { fillColor: [0, 51, 153], textColor: 255, halign: 'left' },
      headStyles: { fontSize: 12 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ['First Name', policy.customerName],
        ['Mobile No', policy.phoneNumber && policy.phoneNumber.trim() !== '' ? policy.phoneNumber : 'Not Available'],
        ['Email', policy.email || 'NA']
      ]
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      head: [['PAYMENT DETAILS']],
      body: [],
      theme: 'grid',
      styles: { fillColor: [0, 51, 153], textColor: 255, halign: 'left' },
      headStyles: { fontSize: 12 }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      body: [
        ['Plan Amount', `₹${policy.amount.toFixed(2)}`],
        ['Amount Of Tax IGST (18%)', `₹${taxAmount.toFixed(2)}`],
        ['Total Amount (Including Tax)', `₹${totalAmount.toFixed(2)}`],
        ['Amount In Words', amountInWords]
      ]
    });

    const planFeatures = policy.planFeatures || [
      ['1', 'Coverage Radius', 'Up to 25 Kms'],
      ['2', 'Towing Service', 'Yes'],
      ['3', 'Flat Tyre Support', 'Yes'],
      ['4', 'Battery Jump Start', 'Yes'],
      ['5', 'Lost Key Assistance', 'Yes']
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      head: [['S.No', 'Plan Features', 'PPEY']],
      body: planFeatures,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
    });

    doc.setFont(undefined, 'italic');
    doc.setFontSize(10);
    doc.text(
      'Note: This is a computer-generated invoice and does not require a signature.',
      20,
      doc.lastAutoTable.finalY + 15
    );

    doc.save(`TaxInvoice_${policy.customerName}.pdf`);
  };

  if (!policy) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-green-600 font-semibold mb-6">Your RSA policy has been activated</p>

          <div className="bg-blue-50 p-4 rounded-md mb-8">
            <h2 className="text-lg font-semibold mb-2">Email Sent Successfully!</h2>
            <p className="text-gray-700">
              A confirmation email with your policy details has been sent to{' '}
              <span className="font-semibold">{policy.email}</span>
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Policy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-gray-600 text-sm">Policy Number:</p><p className="font-semibold">{policy.id}</p></div>
              <div><p className="text-gray-600 text-sm">Policy Type:</p><p className="font-semibold">{policy.policyType}</p></div>
              <div><p className="text-gray-600 text-sm">Customer Name:</p><p className="font-semibold">{policy.customerName}</p></div>
              <div><p className="text-gray-600 text-sm">Vehicle Number:</p><p className="font-semibold">{policy.vehicleNumber}</p></div>
              <div><p className="text-gray-600 text-sm">Valid Until:</p><p className="font-semibold">{expiryDate}</p></div>
              <div><p className="text-gray-600 text-sm">Amount Paid:</p><p className="font-semibold">₹{policy.amount + Math.round(policy.amount * 0.18)}</p></div>
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
            <button
              onClick={generatePDF}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Policy
            </button>

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
