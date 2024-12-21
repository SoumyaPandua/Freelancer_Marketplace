import Review from '../models/review.model.js';
import Order from '../models/order.model.js';

// Fetch completed client projects
export const getClientProjects = async (req, res) => {
  try {
    const clientId = req.user.id;

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Access denied. Only clients can access projects.' });
    }

    const orders = await Order.find({ clientId, status: 'completed' })
      .populate('projectId', 'title')
      .populate('freelancerId', 'name');

    if (!orders.length) {
      return res.status(404).json({ message: 'No completed projects found.' });
    }

    res.status(200).json({ projects: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Add a review
export const addReview = async (req, res) => {
  try {
    const { projectId, rating, feedback } = req.body;
    const reviewerId = req.user.id;

    // Check if user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Access denied. Only clients can leave reviews.' });
    }

    // Validate order completion and ownership
    const order = await Order.findOne({ projectId, clientId: reviewerId, status: 'completed' }).populate('freelancerId');
    console.log(`Debugging Order Query: ProjectID=${projectId}, ReviewerID=${reviewerId}, Order=${JSON.stringify(order)}`);

    if (!order) {
      return res.status(403).json({
        message: 'Unauthorized to review this project. Please ensure the project is completed and linked to your account.',
      });
    }

    const revieweeId = order.freelancerId._id;

    // Check if the client has already reviewed this project
    const existingReview = await Review.findOne({ reviewerId, projectId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this project.' });
    }

    // Create and save review
    const review = new Review({
      reviewerId,
      revieweeId,
      projectId,
      rating,
      feedback,
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully.', review });
  } catch (error) {
    console.error('Error while adding review:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Fetch all reviews for a freelancer
export const getFreelancerReviews = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Access denied. Only freelancers can view their reviews.' });
    }

    const reviews = await Review.find({ revieweeId: freelancerId })
      .populate('reviewerId', 'name email')
      .populate('projectId', 'title');

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found.' });
    }

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Calculate Average Rating for a Freelancer
import mongoose from "mongoose";

export const calculateFreelancerRating = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;

    // Log the freelancerId for debugging
    console.log(`Calculating rating for Freelancer ID: ${freelancerId}`);

    // Ensure `freelancerId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
      console.error("Invalid Freelancer ID:", freelancerId);
      return res.status(400).json({ message: "Invalid Freelancer ID." });
    }

    // Convert freelancerId to ObjectId
    const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

    // Aggregate reviews for the freelancer
    const result = await Review.aggregate([
      { $match: { revieweeId: freelancerObjectId } }, // Match reviews for the freelancer
      {
        $group: {
          _id: "$revieweeId", // Group by freelancer ID
          averageRating: { $avg: "$rating" }, // Calculate average rating
          totalReviews: { $sum: 1 }, // Count total number of reviews
        },
      },
    ]);

    // Log the result of the aggregation query
    console.log("Aggregation Result:", result);

    if (!result.length) {
      return res.status(404).json({
        message: "No reviews found for this freelancer.",
        averageRating: null,
        totalReviews: 0,
      });
    }

    const { averageRating, totalReviews } = result[0];
    res.status(200).json({
      averageRating: averageRating.toFixed(1), // Format to 1 decimal place
      totalReviews,
      message: `${averageRating.toFixed(1)} ★ Average rating from ${totalReviews} reviews`,
    });
  } catch (error) {
    console.error("Error while calculating freelancer rating:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Fetch all reviews with project name, reviewer, reviewee, date, rating, and message
export const getAllReviews = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can view all reviews." });
    }

    // Fetch all reviews and populate related data
    const reviews = await Review.find()
      .populate("projectId", "title") // Fetch project title
      .populate("reviewerId", "name") // Fetch reviewer name
      .populate("revieweeId", "name") // Fetch reviewee (freelancer) name
      .sort({ createdAt: -1 }); // Sort reviews by most recent

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found." });
    }

    // Format the review data for response
    const formattedReviews = reviews.map((review) => ({
      projectName: review.projectId?.title || "N/A",
      reviewerName: review.reviewerId?.name || "Anonymous",
      revieweeName: review.revieweeId?.name || "N/A",
      date: review.createdAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      rating: review.rating,
      feedback: review.feedback,
    }));

    res.status(200).json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};