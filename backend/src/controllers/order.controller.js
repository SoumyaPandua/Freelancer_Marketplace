import Order from '../models/order.model.js';
import Project from '../models/project.model.js';
import User from '../models/user.model.js';

//create order
export const createOrder = async (req, res) => {
  try {
    const { projectId } = req.params;
    const freelancerId = req.user.id; // Assuming req.user is populated via middleware
    const { startDate, deadline } = req.body;

    if (!startDate || !deadline) {
      return res.status(400).json({ message: 'Start date and deadline are required' });
    }

    const parsedStartDate = new Date(startDate);
    const parsedDeadline = new Date(deadline);

    if (isNaN(parsedStartDate) || isNaN(parsedDeadline)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (parsedStartDate < new Date(new Date().toISOString().split('T')[0])) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (parsedDeadline <= parsedStartDate) {
      return res.status(400).json({ message: 'Deadline must be after the start date' });
    }

    const [freelancer, project] = await Promise.all([
      User.findById(freelancerId),
      Project.findById(projectId),
    ]);

    if (!freelancer || freelancer.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can create orders' });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.budget || typeof project.budget !== 'number') {
      return res.status(400).json({ message: 'Project budget is not set or invalid' });
    }

    if (project.clientId.toString() === freelancerId) {
      return res.status(403).json({ message: 'Freelancers cannot order their own projects' });
    }

    const existingOrder = await Order.findOne({ projectId, freelancerId });
    if (existingOrder) {
      return res.status(409).json({ message: 'Order already exists for this project' });
    }

    const order = new Order({
      projectId,
      clientId: project.clientId,
      freelancerId,
      startDate: parsedStartDate,
      deadline: parsedDeadline,
      price: project.budget, // Automatically set price based on project budget
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Process Order
export const processOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }

    const validActions = ['client_approve', 'client_reject', 'client_complete'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        message: `Invalid action. Valid actions are: ${validActions.join(', ')}`,
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.id !== order.clientId.toString() && req.user.id !== order.freelancerId.toString()) {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    await order.processOrder(action);

    res.status(200).json({ message: 'Order processed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch Orders (General)
export const fetchOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let orders;
    if (userRole === 'client') {
      orders = await Order.find({ clientId: userId }).populate('projectId freelancerId');
    } else if (userRole === 'freelancer') {
      orders = await Order.find({ freelancerId: userId }).populate('projectId clientId');
    } else if (userRole === 'admin') {
      orders = await Order.find().populate('projectId clientId freelancerId');
    } else {
      return res.status(403).json({ message: 'Unauthorized to fetch orders' });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch Orders for Freelancer
export const getFreelancerOrders = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Access denied. Only freelancers can access this resource.' });
    }

    const orders = await Order.find({ freelancerId })
      .populate('projectId clientId', 'title description name email') // Populates relevant fields
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching freelancer orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch Orders for Client
export const getClientOrders = async (req, res) => {
  try {
    const clientId = req.user.id;

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Access denied. Only clients can access this resource.' });
    }

    const orders = await Order.find({ clientId })
      .populate('projectId freelancerId', 'title description name email') // Populates relevant fields
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching client orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};