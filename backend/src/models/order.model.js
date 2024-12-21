import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    startDate: {
      type: String, // Store as a string in "YYYY-MM-DD" format
      required: true,
    },
    deadline: {
      type: String, // Store as a string in "YYYY-MM-DD" format
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive value'],
    },
  },
  { timestamps: true }
);

// Pre-save hook to format dates and ensure price is set based on project budget
orderSchema.pre('save', async function (next) {
  if (this.startDate) {
    this.startDate = new Date(this.startDate).toISOString().split('T')[0];
  }
  if (this.deadline) {
    this.deadline = new Date(this.deadline).toISOString().split('T')[0];
  }

  // Fetch project to set the price if not already set
  if (!this.price) {
    const Project = mongoose.model('Project'); // Dynamically reference Project model
    const project = await Project.findById(this.projectId);

    if (!project) {
      return next(new Error('Associated project not found.'));
    }

    this.price = project.budget; // Set the order price from the project's budget
  }

  next();
});

// Method to process order actions
orderSchema.methods.processOrder = async function (action) {
  switch (action) {
    case 'client_approve':
      if (this.status === 'pending') {
        this.status = 'in-progress';
        await this.save();
      }
      break;
    case 'client_reject':
      if (this.status === 'pending') {
        this.status = 'cancelled';
        await this.save();
      }
      break;
    case 'client_complete':
      if (this.status === 'in-progress') {
        this.status = 'completed';
        await this.save();
      }
      break;
    default:
      throw new Error('Invalid action');
  }
};

const Order = mongoose.model('Order', orderSchema);
export default Order;