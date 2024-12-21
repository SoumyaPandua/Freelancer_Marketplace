import api from "./authService";

export const createProject = async (projectData) => {
  const response = await api.post("/projects/create", projectData, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};


export const getAllProjects = async () => {
  try {
    const response = await api.get("/projects/getProjects");
    return response.data;   
  } catch (error) {
    throw error
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/getProjectsById/${id}`);
    return response.data;   
  } catch (error) {
    throw error
  }
};

export const updateProject = async (id, updates) => {
  const response = await api.put(`/projects/update/${id}`, updates, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteProject:", error.response || error.message);
    throw error;
  }
};

// Fetch projects for the client (example implementation)
export const getClientProjects = async () => {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const response = await api.get("/projects/client", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching client projects:", error.message);
    throw error;
  }
};

// Fetch all projects for admin
export const fetchAllProjectsForAdmin = async () => {
  try {
    const response = await api.get(`/projects/admin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you use JWT tokens
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    throw error;
  }
};