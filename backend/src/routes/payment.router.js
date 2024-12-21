import express from 'express';
import isAuthentication from '../middlewares/auth.middleware.js';
import { createPayment, updatePaymentStatus, getPaymentsByClient, getPaymentsByFreelancer,  getDetailedPaymentsForAdmin } from '../controllers/payment.controller.js';

const router = express.Router();

// Create Payment
router.post('/create', isAuthentication, createPayment);

// Update Payment Status
router.patch('/:paymentId/status', isAuthentication, updatePaymentStatus);

// Fetch Payments for a Client
router.get('/client', isAuthentication, getPaymentsByClient);

// Fetch Payments for a freelancer
router.get('/freelancer', isAuthentication, getPaymentsByFreelancer);

// Admin route
router.get('/admin/all', isAuthentication, getDetailedPaymentsForAdmin);

export default router;