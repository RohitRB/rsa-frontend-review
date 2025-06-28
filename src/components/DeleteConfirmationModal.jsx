import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ message, onCancel, onConfirm, loading = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-xl relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={onCancel}
          disabled={loading}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center text-red-600 mb-4">
          <AlertTriangle size={48} />
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Confirm Delete
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
