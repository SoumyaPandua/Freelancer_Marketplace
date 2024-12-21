import React, { useState } from "react";

function TransactionModal({ transaction, onSubmit, onClose }) {
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (transactionId.trim()) {
      setLoading(true);
      try {
        await onSubmit(transactionId); // Call the passed function to handle submission
        onClose(); // Close the modal
      } catch (error) {
        alert(error.message || "Failed to complete payment.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Transaction ID is required.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/3 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Complete Payment</h2>
        <p className="text-sm text-gray-700 mb-4">
          Enter the Transaction ID to complete the payment for 
          <strong> {transaction.projectTitle}</strong>.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction ID
            </label>
            <input
              type="text"
              placeholder="e.g., tnx_1234567890"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
