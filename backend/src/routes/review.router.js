import express from 'express';
import { addReview, getClientProjects, getFreelancerReviews, calculateFreelancerRating, getAllReviews } from '../controllers/review.controller.js';
import { isAuthentication } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Fetch all client projects
router.get('/projects', isAuthentication, getClientProjects);

// Add a review
router.post('/add', isAuthentication, addReview);

// Fetch all reviews for the freelancer
router.get('/freelancer/reviews', isAuthentication, getFreelancerReviews);

// Route to calculate the average rating for a freelancer
router.get("/freelancer/:freelancerId/average-rating", isAuthentication, calculateFreelancerRating);

// Admin route to fetch all reviews
router.get("/admin/all", isAuthentication, getAllReviews)
export default router;