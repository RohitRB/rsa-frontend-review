import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export function generatePolicyPDF(policy) {
  if (!policy) {
    alert('Policy data not available to generate PDF.');
    return;
  }

  // Debug logs for all fields used in the PDF
  console.log('PDF: customerName', policy.customerName);
  console.log('PDF: phoneNumber', policy.phoneNumber);
  console.log('PDF: email', policy.email);
  console.log('PDF: address', policy.address);
  console.log('PDF: city', policy.city);
  console.log('PDF: amount', policy.amount);
  console.log('PDF: vehicleNumber', policy.vehicleNumber);
  console.log('PDF: startDate', policy.startDate);
  console.log('PDF: expiryDate', policy.expiryDate);

  const doc = new jsPDF();
  const totalAmount = parseFloat(policy.amount);
  const startDatePdf = policy.startDate ? format(new Date(policy.startDate), 'dd/MM/yyyy') : 'N/A';
  const expiryDatePdf = policy.expiryDate ? format(new Date(policy.expiryDate), 'dd/MM/yyyy') : 'N/A';
  const amountInWords = convertToWords(totalAmount);

  const invoiceTitle = policy.policyType || 'RSA Policy Invoice';
  const companyName = 'Kalyan Enterprises';
  const customerName = policy.customerName || 'N/A';

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
      policy.vehicleNumber || 'N/A',
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
      ['Customer Name', customerName || 'N/A'],
      ['Mobile No', policy.phoneNumber || 'N/A'],
      ['Email', policy.email || 'N/A'],
      ['Address', `${policy.address || 'N/A'}, ${policy.city || ''}`],
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

  doc.save(`Policy_${policy.policyNumber || policy.id}.pdf`);
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