import express from 'express';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, getClientProjects, getAllProjectsForAdmin } from '../controllers/project.controller.js';
import { isAuthentication } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', isAuthentication, createProject);
router.get('/getProjects', getAllProjects);
router.get('/getProjectsById/:id', getProjectById);
router.put('/update/:id', isAuthentication, updateProject);
router.delete('/delete/:id', isAuthentication, deleteProject);
router.get("/client", isAuthentication, getClientProjects);
router.get("/admin", isAuthentication, getAllProjectsForAdmin);

export default router;