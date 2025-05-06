import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const AddMemberPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [currentMembers, setCurrentMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/project-and-task/${id}`);
        setProjectName(response.data.project.projectName);
        setCurrentMembers(response.data.project.members || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details");
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAddByEmail = () => {
    if (!inviteEmail) return;

    if (!isValidEmail(inviteEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (currentMembers.includes(inviteEmail)) {
      toast.error("This user is already a member of the project");
      return;
    }

    if (selectedUsers.some((user) => user.email === inviteEmail)) {
      toast.error("This user is already in your selection");
      return;
    }

    setSelectedUsers([
      ...selectedUsers,
      {
        id: `temp-${Date.now()}`,
        email: inviteEmail,
        name: inviteEmail,
      },
    ]);
    setInviteEmail("");
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to add");
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, you would make an API call here
      // Giả sử `selectedUsers.map(user => user.email)` trả về một mảng email
      await api
        .put(
          `/projects/${id}/members`,
          selectedUsers.map((user) => user.email)
        )
        .then(() => {
          toast.success(
            `Successfully added ${selectedUsers.length} members to the project`
          );
          navigate(`/home/projects/${id}/detail`);
        })
        .catch((error) => {
          toast.error("User Email not exists");
          // Kiểm tra thêm thông tin chi tiết về lỗi
          if (error.response) {
            console.log("Response data:", error.response.data);
            console.log("Response status:", error.response.status);
          }
        });

      setTimeout(() => {
        // toast.success(
        //   `Successfully added ${selectedUsers.length} members to the project`
        // );
        // navigate(`/home/projects/${id}/detail`);
      }, 1000);
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("Failed to add members");
      setLoading(false);
    }
  };

  if (loading && !projectName) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add Project Members" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => navigate(`/home/projects/${id}/detail`)}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Project
          </button>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-xl font-bold text-white mb-2">
            Add Members to "{projectName}"
          </h1>
          <p className="text-gray-400 mb-6">
            Search for users or invite them by email address to collaborate on
            this project.
          </p>

          {/* Invite by Email Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Invite by Email
            </h2>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddByEmail}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center"
              >
                <UserPlus className="mr-2" size={18} />
                Add
              </button>
            </div>
          </div>

          {/* Selected Users Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Selected Users ({selectedUsers.length})
            </h2>

            {selectedUsers.length === 0 ? (
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 text-center text-gray-400">
                No users selected yet
              </div>
            ) : (
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center bg-gray-600 rounded-full px-3 py-1"
                    >
                      <span className="text-sm text-white mr-2">
                        {user.email}
                      </span>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-gray-300 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-8 space-x-4">
            <button
              onClick={() => navigate(`/home/projects/${id}/detail`)}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMembers}
              disabled={selectedUsers.length === 0 || loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition flex items-center ${
                selectedUsers.length === 0 || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} />
                  Add Selected Members
                </>
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AddMemberPage;
