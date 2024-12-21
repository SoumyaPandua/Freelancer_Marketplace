import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';

//create a payment
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    const clientId = req.user.id; // Assume `req.user` is populated by authentication middleware

    // Validate the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the client owns the order
    if (order.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    // Ensure the order is not already paid (optional, based on your business logic)
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Create the payment
    const payment = new Payment({
      orderId,
      clientId,
      freelancerId: order.freelancerId,
      amount,
      paymentMethod,
    });

    // Save the payment record
    await payment.save();

    res.status(201).json({ message: 'Payment initiated successfully', payment });
  } catch (error) {
    console.error('Error creating payment:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.errors });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Payment Status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;

    const payment = await Payment.findById(paymentId).populate('orderId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update payment status
    payment.status = status;
    if (status === 'completed' && transactionId) {
      payment.transactionId = transactionId;

      // Update the associated order's paymentStatus to "paid"
      const order = await Order.findById(payment.orderId._id);
      if (order) {
        order.paymentStatus = 'paid';
        await order.save();
      }
    }

    await payment.save();

    res.status(200).json({ message: 'Payment status updated successfully', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch Payments for a Client
export const getPaymentsByClient = async (req, res) => {
  try {
    const clientId = req.user.id;
    const payments = await Payment.find({ clientId })
      .populate({
        path: 'orderId',
        select: 'projectId',
        populate: {
          path: 'projectId',
          select: 'title',
        },
      })
      .populate({
        path: 'freelancerId',
        select: 'name email',
      });

    const transformedPayments = payments.map((payment) => {
      return {
        id: payment._id,
        projectTitle: payment.orderId?.projectId?.title || 'Unknown Project',
        freelancer: payment.freelancerId?.name || 'Unknown Freelancer',
        amount: payment.amount,
        status: payment.status,
        date: new Date(payment.createdAt).toLocaleDateString('en-GB'),
      };
    });
    
    res.status(200).json({ payments: transformedPayments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch Payments for a Freelancer
export const getPaymentsByFreelancer = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const payments = await Payment.find({ freelancerId })
      .populate('orderId', 'name description')
      .populate('clientId', 'name email');
    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch Payments with Detailed Data for Admin
export const getDetailedPaymentsForAdmin = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate({
        path: 'orderId',
        select: 'projectId',
        populate: {
          path: 'projectId',
          select: 'title',
        },
      })
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email');

    // Transform payments into the desired structure
    const detailedPayments = payments.map((payment, index) => ({
      id: index + 1,
      projectName: payment.orderId?.projectId?.title || 'Unknown Project',
      clientName: payment.clientId?.name || 'Unknown Client',
      freelancerName: payment.freelancerId?.name || 'Unknown Freelancer',
      amount: payment.amount,
      date: new Date(payment.createdAt).toLocaleDateString('en-GB'),
      status: payment.status || 'Unknown',
    }));
    

    res.status(200).json({ payments: detailedPayments });
  } catch (error) {
    console.error('Error fetching detailed payments for admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};