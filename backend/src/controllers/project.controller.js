import Project from '../models/project.model.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline, skillsRequired } = req.body;
    const clientId = req.user._id; // Assuming `req.user` contains authenticated user info

    const newProject = new Project({
      title,
      description,
      budget,
      deadline,
      skillsRequired,
      clientId,
    });

    const savedProject = await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: savedProject });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create project' });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('clientId', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch projects' });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('clientId', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch project' });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update project' });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project to check its clientId
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if the requester is an admin or the project owner
    if (req.user.role !== 'admin' && req.user._id.toString() !== project.clientId.toString()) {
      return res.status(403).json({ message: 'Access denied. Only admins or the project owner can delete this project.' });
    }

    // Delete the project
    await project.deleteOne();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({ error: error.message || 'Failed to delete project' });
  }
};


export const getClientProjects = async (req, res) => {
  try {
    // Assuming req.user contains authenticated user's details (e.g., from JWT middleware)
    const clientId = req.user._id;

    // Fetch projects where the clientId matches
    const projects = await Project.find({ clientId });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch client projects." });
  }
};

// Fetch all projects for admin
export const getAllProjectsForAdmin = async (req, res) => {
  try {
    // Ensure only admin users can access this endpoint
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can view all projects.' });
    }

    // Fetch all projects along with client and freelancer details
    const projects = await Project.find()
      .populate('clientId', 'name email');

    const projectDetails = projects.map(project => ({
      title: project.title,
      client: project.clientId?.name || 'Unknown',
      budget: project.budget,
      deadline: project.deadline,
      status: project.status || 'Pending',
    }));

    res.status(200).json(projectDetails);
  } catch (error) {
    console.error("Error fetching projects for admin:", error.message);
    res.status(500).json({ message: "Failed to fetch projects." });
  }
};