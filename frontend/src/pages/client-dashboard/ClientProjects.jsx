import { useEffect, useState } from "react";
import ProjectModal from "../../components/client/ProjectModal";
import CreateProjectModal from "../../components/client/CreateProjectModal";
import Alert from "../../components/Alert";
import ConfirmationAlert from "../../components/ConfirmationAlert";
import Loading from "../../components/Loading";
import { getClientProjects, createProject, updateProject, deleteProject } from "../../services/projectService";
import { useNavigate } from "react-router-dom";

function ClientProjects() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "", autoClose: false });
  const [reloadProjects, setReloadProjects] = useState(false);
  const [confirmationAlert, setConfirmationAlert] = useState({ isOpen: false, onConfirm: null, message: "" });

  const navigate = useNavigate();

  // Function to fetch projects
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getClientProjects();
      const projectsWithId = data.map((project) => ({
        ...project,
        id: project._id,
        deadline: project.deadline.split("T")[0], // Format deadline as YYYY-MM-DD
      }));
      setProjects(projectsWithId);
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Failed to fetch projects. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle project creation
  const handleCreateProject = async (newProject) => {
    try {
      await createProject(newProject);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Project created successfully!",
        autoClose: true,
      });
      setIsCreateModalOpen(false);
      setReloadProjects((prev) => !prev);
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Failed to create project. Please try again.",
      });
    }
  };

  // Function to handle project update
  const handleUpdateProject = async (updatedProject) => {
    try {
      await updateProject(selectedProject.id, updatedProject);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Project updated successfully!",
        autoClose: true,
      });
      setIsUpdateModalOpen(false);
      setReloadProjects((prev) => !prev);
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Failed to update project. Please try again.",
      });
    }
  };

  // Function to handle project deletion
  const handleDeleteProject = (projectId) => {
    setConfirmationAlert({
      isOpen: true,
      message: "Are you sure you want to delete this project?",
      onConfirm: async () => {
        try {
          await deleteProject(projectId);  // Call the delete function
          setAlert({
            isOpen: true,
            type: "success",
            message: "Project deleted successfully!",  // Success message
            autoClose: true,  // Close after success
          });
          setReloadProjects((prev) => !prev);  // Trigger re-fetch after delete
        } catch (error) {
          setAlert({
            isOpen: true,
            type: "error",
            message: error.response?.data?.message || "Failed to delete project. Please try again.",
            autoClose: true,  // Close after error
          });
        }
        setConfirmationAlert({ isOpen: false });  // Close the confirmation alert
      },
    });
  };

  useEffect(() => {
    fetchProjects();
  }, [reloadProjects]);

  useEffect(() => {
    if (alert.autoClose) {
      const timeout = setTimeout(() => {
        setAlert({ ...alert, isOpen: false });
        navigate("/client/projects");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [alert, navigate]);

  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setIsUpdateModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create New Project
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold">₹{project.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-semibold">{project.deadline}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => openUpdateModal(project)}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}  // Trigger delete function
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {project.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No projects found. Start by creating a new project!</p>
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <ProjectModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdateProject}
        project={selectedProject}
        mode="update"
      />

      <ConfirmationAlert
        isOpen={confirmationAlert.isOpen}
        onClose={() => setConfirmationAlert({ isOpen: false })}
        onConfirm={confirmationAlert.onConfirm}
        message={confirmationAlert.message}
      />
    </div>
  );
}

export default ClientProjects;