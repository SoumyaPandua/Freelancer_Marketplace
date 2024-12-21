import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';
import { fetchDetailedPaymentsForAdmin } from '../../services/paymentService';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]); // Payments state
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for handling API errors
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [alert, setAlert] = useState({ type: '', message: '' }); // Alert state
  const itemsPerPage = 3;

  // Fetching payments data when the component mounts
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const { success, data } = await fetchDetailedPaymentsForAdmin(); // Fetch detailed payments from the API
        if (success) {
          setPayments(data); // Set the payments data
          setAlert({ type: 'success', message: 'Payments fetched successfully!' });
        } else {
          setError(data.message); // Handle failure response
          setAlert({ type: 'error', message: data.message });
        }
      } catch (err) {
        setError('Error fetching payments data'); // Handle errors
        setAlert({ type: 'error', message: 'Error fetching payments data' });
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchPayments(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-10 space-y-6">
      {/* Alert Message */}
      {alert.message && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />}

      {/* Stylish Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md rounded-lg">
          <Title className="text-white font-semibold">Total Payments</Title>
          <Text className="text-4xl font-bold mt-2">
            ₹{payments.reduce((total, payment) => total + payment.amount, 0)}
          </Text>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md rounded-lg">
          <Title className="text-white font-semibold">Pending Payments</Title>
          <Text className="text-4xl font-bold mt-2">
            ₹{
              payments
                .filter((payment) => payment.status.toLowerCase() === 'pending')
                .reduce((total, payment) => total + payment.amount, 0)
            }
          </Text>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md rounded-lg">
          <Title className="text-white font-semibold">Total Transactions</Title>
          <Text className="text-4xl font-bold mt-2">{payments.length}</Text>
        </Card>
      </div>

      {/* Loading */}
      {loading && <Loading message="Loading payments..." />}

      {/* Payments Table */}
      {!loading && !error && (
        <Card className="shadow-lg rounded-lg border-none outline-none">
          <Title className="text-2xl font-semibold">Payment Transactions</Title>
          <Table className="mt-4 shadow-sm">
            <TableHead>
              <TableRow>
                <TableHeaderCell>No.</TableHeaderCell>
                <TableHeaderCell>Project Name</TableHeaderCell>
                <TableHeaderCell>Client Name</TableHeaderCell>
                <TableHeaderCell>Freelancer Name</TableHeaderCell>
                <TableHeaderCell>Amount (₹)</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPayments.map((payment, index) => (
                <TableRow key={payment.id} className="hover:bg-gray-50 transition">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{payment.projectName}</TableCell>
                  <TableCell className="text-blue-600 font-semibold">{payment.clientName}</TableCell>
                  <TableCell className="text-green-600 font-semibold">{payment.freelancerName}</TableCell>
                  <TableCell className="font-medium text-gray-700">₹{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(payment.status)} px-3 py-1 rounded-full`}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Custom Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="shadow-lg rounded-lg border-none outline-none">
        <Title className="text-2xl font-semibold">Recent Transactions</Title>
        <div className="mt-4 space-y-4">
          {currentPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <Text className="font-semibold text-gray-800">{payment.projectName}</Text>
                <Text className="text-sm text-gray-500">{payment.date}</Text>
              </div>
              <div className="flex items-center gap-4">
                <Text
                  className={`font-semibold ${
                    payment.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  ₹{payment.amount}
                </Text>
                <Badge className={`${getStatusColor(payment.status)} px-3 py-1 rounded-full`}>
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminPayments;