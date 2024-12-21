import express from 'express';
import { register, login, logout, updateProfile, deleteProfile, fetchProfile, fetchAllUsers, deleteUser } from '../controllers/user.controller.js';
import { isAuthentication, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes
router.post('/register', register); // User registration
router.post('/login', login);       // User login
router.post('/logout', logout);     // User logout
router.get('/profile-fetch', isAuthentication, fetchProfile);  // user fetch profile
router.put('/profile/update', isAuthentication, updateProfile);  // user update profile
router.delete('/delete/:id', isAuthentication, verifyAdmin, deleteProfile);
router.get('/admin/users', isAuthentication, verifyAdmin, fetchAllUsers);
router.delete('/admin/users/:id', isAuthentication, verifyAdmin, deleteUser);

export default router;