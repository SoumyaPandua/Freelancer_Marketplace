import mongoose from 'mongoose';
import Bid from './bid.model.js'; // Ensure this path is correct

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be a positive value'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    skillsRequired: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v),
        message: 'Skills must be an array of strings',
      },
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Initially null, will be set later
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
  },
  { timestamps: true }
);

// Middleware to delete bids when a project is deleted
projectSchema.pre('findOneAndDelete', async function (next) {
  const projectId = this.getQuery()._id;

  // Delete all bids associated with the project
  await Bid.deleteMany({ projectId });

  next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;