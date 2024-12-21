import { useState, useEffect } from "react";
import Alert from "../../components/Alert"; // Ensure the correct path
import Loading from "../../components/Loading";
import { fetchProfile, updateProfile } from "../../services/authService"; // Adjust path if necessary

function AdminProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

  const fetchAdminDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchProfile();
      setProfileData(data);
    } catch (error) {
      setAlert({ isOpen: true, type: "error", message: error || "Failed to fetch admin details." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        name: profileData.name,
        location: profileData.location,
        profileImage: profileData.profileImage,
      };
      const response = await updateProfile(updatedData);
      setProfileData(response);
      setAlert({ isOpen: true, type: "success", message: "Profile updated successfully." });
      setIsEditing(false);
      setTimeout(() => {
        setAlert({ ...alert, isOpen: false });
      }, 1000);
    } catch (error) {
      setAlert({ isOpen: true, type: "error", message: error || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevState) => ({
          ...prevState,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <div className="profile-container">
      {loading && <Loading />}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Profile</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                {profileData.name.charAt(0)}
              </div>
            )}
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.role}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border rounded-md"
                value={profileData.name}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded-md"
                value={profileData.email}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                name="role"
                className="w-full px-3 py-2 border rounded-md"
                value={profileData.role}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                className="w-full px-3 py-2 border rounded-md"
                value={profileData.location}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            {isEditing && (
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
