import express from 'express';
import { placeBid, manageBid, getBidsForProject, getFreelancerBids, getClientBids, getAllBidsForAdmin } from '../controllers/bid.controller.js';
import { isAuthentication } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:projectId/bid', isAuthentication, placeBid);
router.put('/:bidId/status', isAuthentication, manageBid);
router.get('/project/:projectId', isAuthentication, getBidsForProject);
router.get('/freelancer', isAuthentication, getFreelancerBids);
router.get('/client', isAuthentication, getClientBids);
router.get('/admin', isAuthentication, getAllBidsForAdmin);

export default router;