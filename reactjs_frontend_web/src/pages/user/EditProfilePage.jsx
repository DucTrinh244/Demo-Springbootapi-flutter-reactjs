import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig"; // Axios instance có sẵn baseURL và token nếu cần

const EditProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [emailError, setEmailError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(profile.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");

    try {
      const response = await api.put("/users/profile", profile); // Gửi dữ liệu lên server
      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative">
      <Header title="Edit Profile" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl rounded-xl border border-gray-700 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Edit Your Profile
          </h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={profile.name}
                onChange={handleChange}
                className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={profile.email}
                onChange={handleChange}
                className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-400">{emailError}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              className="py-3 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              onClick={fetchProfile}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-500 hover:to-blue-400 transition font-medium"
            >
              Save Changes
            </button>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default EditProfilePage;
