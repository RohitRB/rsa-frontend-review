 const PolicyModal = ({ customerId ,policy, onClose }) => {
  
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-lg shadow-lg overflow-y-auto space-y-2">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Policy Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>

        <div className="px-6 py-4 space-y-4 text-sm">
          <div className="flex justify-between">
            <div><strong>Policy ID</strong><br />{policy.id}</div>
            <div><strong>Status</strong><br />
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><strong>Customer Name</strong><br />{policy.customerName}</div>
            {/* <div><strong>Phone Number</strong><br />{policy.phone}</div> */}
            <div><strong>Email</strong><br />{policy.email}</div>
            <div><strong>Vehicle Number</strong><br />{policy.vehicleNumber}</div>
            <div><strong>Start Date</strong><br />{policy.startDate}</div>
            <div><strong>Expiry Date</strong><br />{policy.expiryDate}</div>
            <div><strong>Duration</strong><br />{policy.duration}</div>
            {/* <div><strong>Amount Paid</strong><br />₹{policy.amountPaid}</div> */}
            <div className="col-span-2"><strong>Address</strong><br />{policy.address}</div>
          </div>

          <div className="pt-4">
            {/* <h3 className="font-semibold mb-2">Policy History</h3> */}
            {/* <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 border">Date</th>
                  <th className="text-left p-2 border">Action</th>
                  <th className="text-left p-2 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {policy.history.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{item.date}</td>
                    <td className="p-2 border">{item.action}</td>
                    <td className="p-2 border">{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
          {/* <button className="px-4 py-2 bg-blue-600 text-white rounded">Edit Policy</button> */}
        </div>
      </div>
    </div>
  );
}
export default PolicyModal;
