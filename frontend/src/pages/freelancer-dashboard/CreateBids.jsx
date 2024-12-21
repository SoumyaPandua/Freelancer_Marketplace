import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { placeBid } from '../../services/bidService'; // Import placeBid function
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';

const validationSchema = Yup.object({
  bidAmount: Yup.number()
    .required('Bid amount is required')
    .min(1, 'Bid amount must be greater than 0'),
  proposal: Yup.string()
    .required('Proposal is required')
    .min(50, 'Proposal must be at least 50 characters')
    .max(1000, 'Proposal must not exceed 1000 characters')
});

function CreateBids() {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project;

  // State to manage loading and alert
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: 'success' });

  const formik = useFormik({
    initialValues: {
      bidAmount: '',
      proposal: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true); // Start loading
      try {
        const response = await placeBid(project._id, values); // Call API to place bid
        setAlert({ isOpen: true, message: 'Bid placed successfully!', type: 'success' }); // Show success alert
        setTimeout(() => {
          setAlert({ isOpen: false, message: '', type: '' });
          navigate('/freelancer/projects'); // Navigate to projects
        }, 3000);
      } catch (error) {
        setAlert({ isOpen: true, message: error.message || 'Failed to place bid.', type: 'error' }); // Show error alert
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">No project selected. Please select a project first.</p>
          <button
            onClick={() => navigate('/freelancer/projects')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-100 p-8">
      {isLoading && <Loading />} {/* Show Loading Indicator */}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ isOpen: false, message: '', type: '' })}
      />

      <div className="max-w-2xl mx-auto">
        {/* Project Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{project.title}</h2>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Budget: ₹{project.budget}</span>
            <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Bid Form */}
        <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Submit Your Bid</h3>

          <div className="mb-6">
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount (₹)
            </label>
            <input
              type="number"
              id="bidAmount"
              name="bidAmount"
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.bidAmount && formik.errors.bidAmount
                  ? 'border-red-500'
                  : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              {...formik.getFieldProps('bidAmount')}
            />
            {formik.touched.bidAmount && formik.errors.bidAmount && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.bidAmount}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
              Proposal
            </label>
            <textarea
              id="proposal"
              name="proposal"
              rows="6"
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.proposal && formik.errors.proposal
                  ? 'border-red-500'
                  : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              {...formik.getFieldProps('proposal')}
            />
            {formik.touched.proposal && formik.errors.proposal && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.proposal}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Characters: {formik.values.proposal.length}/1000
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Submitting...' : 'Submit Bid'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/freelancer/projects')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBids;