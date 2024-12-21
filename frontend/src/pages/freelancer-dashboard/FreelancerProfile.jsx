import { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../../services/authService";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

function FreelancerProfile() {
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
    portfolio: [], // Updated to match array structure
  });
  const [skillInput, setSkillInput] = useState(""); // For skills input
  const [portfolioInput, setPortfolioInput] = useState(""); // For portfolio input
  const [alert, setAlert] = useState({ type: "", message: "", isOpen: false });
  const [showModal, setShowModal] = useState(false); // Modal state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfileData(data);
      } catch (error) {
        setAlert({ type: "error", message: error || "Failed to fetch profile.", isOpen: true });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setProfileData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      reader.readAsDataURL(file);
    }
  };

  // Skill Handling
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillAdd = () => {
    if (!skillInput.trim()) return;
    const newSkills = skillInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill && !profileData.skills.includes(skill));

    if (newSkills.length > 0) {
      setProfileData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, ...newSkills],
      }));
    }
    setSkillInput("");
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Portfolio Handling
  const handlePortfolioInputChange = (e) => {
    setPortfolioInput(e.target.value);
  };

  const handlePortfolioAdd = () => {
    if (!portfolioInput.trim() || profileData.portfolio.includes(portfolioInput.trim())) return;
    setProfileData((prevData) => ({
      ...prevData,
      portfolio: [...prevData.portfolio, portfolioInput.trim()],
    }));
    setPortfolioInput("");
  };

  const handlePortfolioRemove = (portfolioToRemove) => {
    setProfileData((prevData) => ({
      ...prevData,
      portfolio: prevData.portfolio.filter((item) => item !== portfolioToRemove),
    }));
  };

  const handleUpdate = async () => {
    try {
      const { email, role, ...updateData } = profileData; // Exclude email and role
      await updateProfile(updateData);
      setAlert({ type: "success", message: "Profile updated successfully!", isOpen: true });
      setTimeout(() => {
        setAlert({ isOpen: false });
      }, 1000); // Close alert after 1 second
      setShowModal(false);
    } catch (error) {
      setAlert({ type: "error", message: error || "Failed to update profile.", isOpen: true });
      setTimeout(() => {
        setAlert({ isOpen: false });
      }, 1000); // Close alert after 1 second
    }
  };
  

  return (
    <div className="profile-container">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Freelancer Profile</h1>

      {alert.isOpen && (
        <Alert type={alert.type} message={alert.message} isOpen={alert.isOpen} onClose={() => setAlert({ isOpen: false })} />
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center">
            <img
              src={profileData.profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.role}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Data Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" value={profileData.name} className="w-full px-3 py-2 border rounded-md" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={profileData.email} className="w-full px-3 py-2 border rounded-md" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input type="text" name="role" value={profileData.role} className="w-full px-3 py-2 border rounded-md" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" value={profileData.location} className="w-full px-3 py-2 border rounded-md" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <input type="text" name="hourlyRate" value={profileData.hourlyRate} className="w-full px-3 py-2 border rounded-md" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" name="companyName" value={profileData.companyName} className="w-full px-3 py-2 border rounded-md" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.portfolio.map((link, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                      <button
                        type="button"
                        onClick={() => handlePortfolioRemove(link)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea name="bio" value={profileData.bio} className="w-full px-3 py-2 border rounded-md" rows="4" readOnly />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                onClick={() => setShowModal(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="4"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={profileData.hourlyRate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Skills - Editable section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <div className="flex gap-2 flex-wrap">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center mt-2 gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onKeyDown={(e) => (e.key === "Enter" ? handleSkillAdd() : null)}
                    className="flex-grow px-4 py-2 border rounded-md"
                    placeholder="Type skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleSkillAdd}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio Links</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.portfolio.map((link, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {link}
                      <button
                        type="button"
                        onClick={() => handlePortfolioRemove(link)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center mt-2 gap-2">
                  <input
                    type="text"
                    value={portfolioInput}
                    onChange={handlePortfolioInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handlePortfolioAdd()}
                    className="flex-grow px-4 py-2 border rounded-md"
                    placeholder="Enter portfolio link and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handlePortfolioAdd}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>


              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                onClick={handleUpdate}
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

export default FreelancerProfile;