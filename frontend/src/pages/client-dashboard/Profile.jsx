import { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../../services/authService";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading"; // Import the Loading component

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    bio: "",
    profileImage: "",
    skills: [],
    hourlyRate: 0,
    companyName: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "", isOpen: false });
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfileData(data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setAlert({
          type: "error",
          message: error || "Failed to fetch profile. Please try again later.",
          isOpen: true,
        });
        setLoading(false); // Set loading to false even if there is an error
      }
    };
    loadProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle file input change for profile image
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

  // Handle profile update
  const handleUpdate = async () => {
    try {
      // Create a copy of the profileData without email and role for update
      const updateData = { ...profileData };
      delete updateData.email;
      delete updateData.role;
  
      const updatedProfile = await updateProfile(updateData);
      setProfileData(updatedProfile); // Update state with new profile data
      setAlert({ type: "success", message: "Profile updated successfully!", isOpen: true });
  
      // Close the modal after updating
      setShowModal(false);
  
      setTimeout(() => {
        setAlert({ ...alert, isOpen: false });
      }, 1000);
    } catch (error) {
      setAlert({
        type: "error",
        message: error || "Failed to update profile. Please try again.",
        isOpen: true,
      });
    }
  };

  return (
    <div className="profile-container">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      {/* Show Loading component if data is being fetched */}
      {loading && <Loading />}

      {!loading && (
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.name}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.email}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.role}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.location}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                className="w-full px-3 py-2 border rounded-md"
                rows="4"
                value={profileData.bio}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                onClick={() => setShowModal(true)} // Open modal
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing profile */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  className="w-full px-3 py-2 border rounded-md"
                  rows="4"
                  value={profileData.bio}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-3 py-2 border rounded-md"
                  value={profileData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                onClick={handleUpdate} // Update profile
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;