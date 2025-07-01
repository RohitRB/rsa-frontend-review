import React from 'react';
import { X, Download } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PolicyModal = ({ policy, onClose }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-700';
      case 'Expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Download policy as PDF
  const downloadPolicy = () => {
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
    
    const startDate = formatDate(policy.startDate);
    const expiryDate = formatDate(policy.expiryDate);
    const createdDate = formatDate(policy.createdAt);
    
    doc.autoTable({
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['Policy Details']],
      body: [
        ['Policy Number', policy.policyNumber || policy.id || 'N/A'],
        ['Policy Type', policy.policyType || 'N/A'],
        ['Customer Name', policy.customerName || 'N/A'],
        ['Vehicle Number', policy.vehicleNumber || 'N/A'],
        ['Start Date', startDate],
        ['Expiry Date', expiryDate],
        ['Duration', policy.duration || 'N/A'],
        ['Amount Paid', `₹${policy.amount || 0}`],
        ['Created Date', createdDate]
      ]
    });
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      head: [['Customer Details']],
      body: [
        ['Email', policy.email || 'N/A'],
        ['Phone', policy.phoneNumber || 'N/A'],
        ['Address', `${policy.address || 'N/A'}, ${policy.city || 'N/A'}`]
      ]
    });
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Service Features']],
      body: [
        ['24/7 Roadside Assistance', 'Yes'],
        ['Nation Wide Towing', 'Yes'],
        ['Flat Tire Assistance', 'Yes'],
        ['Fuel Delivery', 'Yes'],
        ['Battery Jump Start', 'Yes']
      ],
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 }
    });
    
    doc.setFontSize(10);
    doc.text(
      'Note: This is a computer-generated policy document and does not require a signature.',
      20,
      doc.lastAutoTable.finalY + 15
    );
    
    doc.save(`Policy_${policy.policyNumber || policy.id || 'Modal'}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-lg shadow-lg overflow-y-auto space-y-2">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Policy Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 text-sm">
          <div className="flex justify-between">
            <div><strong>Policy ID</strong><br />{policy.policyNumber || policy.id}</div>
            <div><strong>Status</strong><br />
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(policy.status)}`}>
                {policy.status || 'Active'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><strong>Customer Name</strong><br />{policy.customerName}</div>
            <div><strong>Email</strong><br />{policy.email}</div>
            <div><strong>Vehicle Number</strong><br />{policy.vehicleNumber}</div>
            <div><strong>Duration</strong><br />{policy.duration}</div>
            <div><strong>Start Date</strong><br />{formatDate(policy.startDate)}</div>
            <div><strong>Expiry Date</strong><br />{formatDate(policy.expiryDate)}</div>
            <div><strong>Amount Paid</strong><br />₹{policy.amountPaid || 'N/A'}</div>
            <div><strong>Created Date</strong><br />{formatDate(policy.createdAt)}</div>
            <div className="col-span-2"><strong>Address</strong><br />{policy.address || 'N/A'}</div>
          </div>

          {policy.phoneNumber && (
            <div>
              <strong>Phone Number</strong><br />{policy.phoneNumber}
            </div>
          )}

          {policy.city && (
            <div>
              <strong>City</strong><br />{policy.city}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={downloadPolicy} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Download Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
