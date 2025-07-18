import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

function convertFirestoreTimestamp(ts) {
  if (ts && typeof ts === 'object' && '_seconds' in ts) {
    return new Date(ts._seconds * 1000);
  }
  return ts ? new Date(ts) : null;
}

function safeString(val) {
  if (val === undefined || val === null) return 'N/A';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val).trim() || 'N/A';
}

function flattenPolicy(policy) {
  return {
    ...policy,
    customerName: safeString(policy.customerName),
    phoneNumber: safeString(policy.phoneNumber),
    email: safeString(policy.email),
    address: safeString(policy.address),
    city: safeString(policy.city),
    policyType: safeString(policy.policyType),
    vehicleNumber: safeString(policy.vehicleNumber),
    amount: policy.amount !== undefined && policy.amount !== null ? Number(policy.amount) : 0,
    duration: safeString(policy.duration),
    status: safeString(policy.status),
    // Add more fields as needed
  };
}

export function generatePolicyPDF(policy) {
  if (!policy) {
    alert('Policy data not available to generate PDF.');
    return;
  }
  const flatPolicy = flattenPolicy(policy);

  const doc = new jsPDF();
  const totalAmount = flatPolicy.amount;
  const startDateObj = convertFirestoreTimestamp(flatPolicy.startDate);
  const expiryDateObj = convertFirestoreTimestamp(flatPolicy.expiryDate);
  const purchaseDateObj = convertFirestoreTimestamp(flatPolicy.purchaseDate);
  const createdAtObj = convertFirestoreTimestamp(flatPolicy.createdAt);
  const updatedAtObj = convertFirestoreTimestamp(flatPolicy.updatedAt);
  const startDatePdf = startDateObj ? format(startDateObj, 'dd/MM/yyyy') : 'N/A';
  const expiryDatePdf = expiryDateObj ? format(expiryDateObj, 'dd/MM/yyyy') : 'N/A';
  const amountInWords = convertToWords(totalAmount);

  // Determine policy type and duration from available data
  const policyType = flatPolicy.policyType || 'RSA Policy';
  const duration = flatPolicy.duration || '1 Year'; // Default duration if not provided
  
  const invoiceTitle = policyType;
  const companyName = 'Kalyan Enterprises';
  const customerName = flatPolicy.customerName || 'N/A';

  // Header
  doc.setFillColor(0, 51, 153);
  doc.rect(0, 0, 210, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(companyName, 105, 11, { align: 'center' });

  // Certificate Table
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.autoTable({
    startY: 20,
    head: [[
      'Certificate Start Date',
      'Certificate End Date',
      'Vehicle Registration Number',
    ]],
    body: [[
      startDatePdf,
      expiryDatePdf,
      flatPolicy.vehicleNumber || 'N/A',
    ]],
    theme: 'grid',
    headStyles: { fillColor: [26, 188, 156], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // Personal Details
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 6,
    head: [['PERSONAL DETAILS']],
    body: [
      ['Customer Name', flatPolicy.customerName],
      ['Mobile No', flatPolicy.phoneNumber],
      ['Email', flatPolicy.email],
      ['Address', flatPolicy.address + (flatPolicy.city !== 'N/A' ? ', ' + flatPolicy.city : '')],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // Payment Details
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 6,
    head: [['PAYMENT DETAILS']],
    body: [
      ['Plan Amount', totalAmount ? `₹${totalAmount.toFixed(2)}` : 'N/A'],
      ['Total Amount Paid', totalAmount ? `₹${totalAmount.toFixed(2)}` : 'N/A'],
      ['Amount In Words', amountInWords],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // Features
  const policyFeaturesForPdf = [
    ['1', '24/7 Roadside Assistance', 'Yes'],
    ['2', 'Nation Wide Towing', 'Yes'],
    ['3', 'Flat Tire Assistance', 'Yes'],
    ['4', 'Fuel Delivery', 'Yes'],
    ['5', 'Battery Jump Start', 'Yes'],
  ];
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 6,
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

  // Use policyId from API response, fallback to policyNumber or id
  const policyIdentifier = flatPolicy.policyId || flatPolicy.policyNumber || flatPolicy.id;
  doc.save(`Policy_${policyIdentifier}.pdf`);
}

// Function to generate PDF as blob for email attachments
export function generatePolicyPDFAsBlob(policy) {
  if (!policy) {
    return null;
  }
  const flatPolicy = flattenPolicy(policy);

  const doc = new jsPDF();
  const totalAmount = flatPolicy.amount;
  const startDateObj = convertFirestoreTimestamp(flatPolicy.startDate);
  const expiryDateObj = convertFirestoreTimestamp(flatPolicy.expiryDate);
  const purchaseDateObj = convertFirestoreTimestamp(flatPolicy.purchaseDate);
  const createdAtObj = convertFirestoreTimestamp(flatPolicy.createdAt);
  const updatedAtObj = convertFirestoreTimestamp(flatPolicy.updatedAt);
  const startDatePdf = startDateObj ? format(startDateObj, 'dd/MM/yyyy') : 'N/A';
  const expiryDatePdf = expiryDateObj ? format(expiryDateObj, 'dd/MM/yyyy') : 'N/A';
  const amountInWords = convertToWords(totalAmount);

  // Determine policy type and duration from available data
  const policyType = flatPolicy.policyType || 'RSA Policy';
  const duration = flatPolicy.duration || '1 Year'; // Default duration if not provided
  
  const invoiceTitle = policyType;
  const companyName = 'Kalyan Enterprises';
  const customerName = flatPolicy.customerName || 'N/A';

  // Header
  doc.setFillColor(0, 51, 153);
  doc.rect(0, 0, 210, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(companyName, 105, 11, { align: 'center' });

  // Certificate Table
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.autoTable({
    startY: 20,
    head: [[
      'Certificate Start Date',
      'Certificate End Date',
      'Vehicle Registration Number',
    ]],
    body: [[
      startDatePdf,
      expiryDatePdf,
      flatPolicy.vehicleNumber || 'N/A',
    ]],
    theme: 'grid',
    headStyles: { fillColor: [26, 188, 156], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // Personal Details
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 6,
    head: [['PERSONAL DETAILS']],
    body: [
      ['Customer Name', flatPolicy.customerName],
      ['Mobile No', flatPolicy.phoneNumber],
      ['Email', flatPolicy.email],
      ['Address', flatPolicy.address + (flatPolicy.city !== 'N/A' ? ', ' + flatPolicy.city : '')],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // Payment Details
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 6,
    head: [['PAYMENT DETAILS']],
    body: [
      ['Plan Amount', totalAmount ? `₹${totalAmount.toFixed(2)}` : 'N/A'],
      ['Total Amount Paid', totalAmount ? `₹${totalAmount.toFixed(2)}` : 'N/A'],
      ['Amount In Words', amountInWords],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: 'bold', fontSize: 13 },
    styles: { fontSize: 11, cellPadding: 3 },
  });

  // Features
  const policyFeaturesForPdf = [
    ['1', '24/7 Roadside Assistance', 'Yes'],
    ['2', 'Nation Wide Towing', 'Yes'],
    ['3', 'Flat Tire Assistance', 'Yes'],
    ['4', 'Fuel Delivery', 'Yes'],
    ['5', 'Battery Jump Start', 'Yes'],
  ];
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 6,
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

  // Convert PDF to blob
  const pdfOutput = doc.output('blob');
  return new Blob([pdfOutput], { type: 'application/pdf' });
}

function convertToWords(amount) {
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
} 