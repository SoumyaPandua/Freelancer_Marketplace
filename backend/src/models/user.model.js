import mongoose from 'mongoose';
import Bid from './bid.model.js'; // Ensure this path is correct

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['freelancer', 'client', 'admin'],
      required: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v),
        message: 'Skills must be an array of strings',
      },
    },
    portfolio: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: [0, 'Hourly rate must be a positive value'],
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index to optimize queries
userSchema.index({ email: 1, role: 1 });

// Middleware to delete bids when a user is deleted
userSchema.pre('findOneAndDelete', async function (next) {
  const userId = this.getQuery()._id;

  // Delete all bids associated with the user (as freelancer or client)
  await Bid.deleteMany({
    $or: [{ freelancerId: userId }, { 'project.clientId': userId }],
  });

  next();
});

const User = mongoose.model('User', userSchema);
export default User;