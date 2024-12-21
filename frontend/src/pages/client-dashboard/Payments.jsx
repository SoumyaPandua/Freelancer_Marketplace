import React, { useState, useEffect } from "react";
import AddPaymentModal from "../../components/client/AddPaymentModal";
import TransactionModal from "../../components/client/TransactionModal";
import { fetchPaymentsByClient, updatePaymentStatus } from "../../services/paymentService";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

function Payments() {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [payments, setPayments] = useState([]);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPaymentsByClient();
        if (result.success) {
          setPayments(result.data);
        } else {
          setError("Failed to fetch payments.");
        }
      } catch (err) {
        setError("An error occurred while fetching payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCompleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleTransactionSubmit = async (transactionId) => {
    if (!selectedTransaction) return;

    const { id } = selectedTransaction;
    try {
      await updatePaymentStatus({ paymentId: id, status: "completed", transactionId });
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id ? { ...payment, status: "completed", transactionId } : payment
        )
      );
      showAlert("success", "Payment marked as completed successfully!");
    } catch (error) {
      showAlert("error", "Failed to mark payment as completed.");
    }
  };

  const handleFailedClick = async (transaction) => {
    if (!transaction) return;

    const { id } = transaction;
    try {
      await updatePaymentStatus({ paymentId: id, status: "failed" });
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id ? { ...payment, status: "failed" } : payment
        )
      );
      showAlert("success", "Payment marked as failed successfully!");
    } catch (error) {
      showAlert("error", "Failed to mark payment as failed.");
    }
  };

  const showAlert = (type, message) => {
    setAlert({ isOpen: true, type, message });
    setTimeout(() => {
      setAlert({ isOpen: false, type: "", message: "" });
      window.location.reload(); // Reload the page
    }, 1000);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert type="error" message={error} isOpen={true} onClose={() => setError(null)} />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Payments</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddPaymentModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          Add Payment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project & Freelancer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.projectTitle}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.freelancer}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {payment.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleCompleteClick(payment)}
                        className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleFailedClick(payment)}
                        className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600"
                      >
                        Failed
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddPaymentModal && (
        <AddPaymentModal onClose={() => setShowAddPaymentModal(false)} />
      )}

      {showTransactionModal && selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onSubmit={handleTransactionSubmit}
          onClose={() => setShowTransactionModal(false)}
        />
      )}

      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ isOpen: false, type: "", message: "" })}
      />
    </div>
  );
}

export default Payments;
