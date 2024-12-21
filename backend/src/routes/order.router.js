// routes/order.router.js
import express from 'express';
import { createOrder, processOrder, fetchOrders, getFreelancerOrders, getClientOrders } from '../controllers/order.controller.js';
import { isAuthentication } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create/:projectId', isAuthentication, createOrder);
router.put('/:orderId', isAuthentication, processOrder);
router.get('/fetch', isAuthentication, fetchOrders);
router.get('/freelancer', isAuthentication, getFreelancerOrders);
router.get('/client', isAuthentication, getClientOrders);

export default router;