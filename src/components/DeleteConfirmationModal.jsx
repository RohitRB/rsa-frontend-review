
 const DeleteConfirmationModal = ({ policyId, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-xl relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={onCancel}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center text-red-600 mb-4">
          <AlertTriangle size={48} />
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Delete Policy?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to permanently delete policy{" "}
          <strong>{policyId}</strong>? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(policyId)}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;
