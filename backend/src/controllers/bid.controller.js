import Bid from '../models/bid.model.js';
import Project from '../models/project.model.js';
import User from '../models/user.model.js';

// Place a Bid
export const placeBid = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { bidAmount, proposal } = req.body;
        const freelancerId = req.user.id;

        // Check role
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can place bids' });
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the project is open
        if (project.status !== 'open') {
            return res.status(400).json({ message: 'Bids cannot be placed on closed projects' });
        }

        // Create bid
        const bid = new Bid({
            projectId,
            freelancerId,
            bidAmount,
            proposal,
        });

        await bid.save();
        res.status(201).json({ message: 'Bid placed successfully', bid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Manage a Bid (Accept/Reject)
// Manage a Bid (Accept/Reject)
export const manageBid = async (req, res) => {
    try {
      const { bidId } = req.params;
      const { action } = req.body; // action can be 'accept' or 'reject'
  
      const bid = await Bid.findById(bidId).populate('projectId');
      if (!bid) {
        return res.status(404).json({ message: 'Bid not found' });
      }
  
      if (bid.projectId.clientId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to manage this bid' });
      }
  
      if (!['accept', 'reject'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
      }
  
      // Update the bid status
      bid.status = action === 'accept' ? 'accepted' : 'rejected';
      await bid.save();
  
      if (action === 'accept') {
        const project = bid.projectId;
  
        // Update project details
        project.status = 'in-progress';
        project.budget = bid.bidAmount; // Update the project's budget
        project.freelancerId = bid.freelancerId; // Assign freelancer to the project
        await project.save();
  
        // Create an order for the accepted bid
        const existingOrder = await Order.findOne({
          projectId: project._id,
          freelancerId: bid.freelancerId,
        });
  
        if (!existingOrder) {
          const order = await Order.create({
            projectId: project._id,
            clientId: project.clientId,
            freelancerId: bid.freelancerId,
            status: 'in-progress',
            startDate: new Date().toISOString().split('T')[0], // Start date as today
            deadline: new Date(project.deadline).toISOString().split('T')[0], // Use project's deadline
            price: bid.bidAmount, // Set price based on the bid amount
          });
  
          console.log(`Order created successfully: ${order._id}`);
        }
      }
  
      res.status(200).json({ message: `Bid ${action}ed successfully`, bid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };  

// Fetch Bids for a Specific Project
export const getBidsForProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Fetch bids for the specific project
        const bids = await Bid.find({ projectId }).populate('freelancerId', 'name email');

        res.status(200).json({
            message: 'Bids fetched successfully',
            bids,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch All Bids for Logged-In Freelancer
export const getFreelancerBids = async (req, res) => {
    try {
        const freelancerId = req.user.id;

        // Ensure the user is a freelancer
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can view their bids' });
        }

        // Fetch all bids for the freelancer
        const bids = await Bid.find({ freelancerId }).populate('projectId', 'title clientId');

        res.status(200).json({ message: 'Bids fetched successfully', bids });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch All Bids for Client's Projects
export const getClientBids = async (req, res) => {
    try {
        const clientId = req.user.id;

        // Ensure the user is a client
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can view their bids' });
        }

        // Fetch all projects owned by the client
        const projects = await Project.find({ clientId });
        if (!projects.length) {
            return res.status(404).json({ message: 'No projects found for this client' });
        }

        // Fetch bids for all projects
        const bids = await Bid.find({ projectId: { $in: projects.map(p => p._id) } }).populate('freelancerId', 'name email');

        res.status(200).json({
            message: 'Bids fetched successfully',
            bids,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch All Bids for Admin
export const getAllBidsForAdmin = async (req, res) => {
    try {
        // Ensure the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can view all bids' });
        }

        // Fetch all bids with associated project and user details
        const bids = await Bid.find()
            .populate({
                path: 'projectId',
                select: 'title clientId',
                populate: {
                    path: 'clientId', // Populate client details from clientId
                    select: 'name email', // Select client name and email
                },
            })
            .populate('freelancerId', 'name email'); // Populate freelancer details

        // Format the bids for response
        const formattedBids = bids.map(bid => ({
            projectTitle: bid.projectId.title,
            submitted: bid.createdAt,
            freelancer: bid.freelancerId.name,
            client: bid.projectId.clientId.name, // Fetch client's name from populated clientId
            bidAmount: bid.bidAmount,
            status: bid.status,
        }));

        res.status(200).json({
            message: 'All bids fetched successfully',
            bids: formattedBids,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};