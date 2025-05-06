import { Check, ChevronLeft, Plus, Search, User, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const AddRoomPage = () => {
  // State management
  const [roomName, setRoomName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const navigate = useNavigate();

  // Get current user information on component mount
  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setCurrentUserEmail(userEmail);
      // Add current user to selected users by default
      setSelectedUsers([{ email: userEmail, name: userEmail.split("@")[0] }]);
    }

    // Fetch all users
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery) {
      setSearchLoading(true);
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.name &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
      setSearchLoading(false);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");

      // Transform user data if needed
      const userData = response.data.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.firstName || user.email.split("@")[0],
        avatar: user.profileImage || null,
      }));

      // Filter out current user from the list
      const filteredUsers = userData.filter(
        (user) => user.email !== currentUserEmail
      );
      setUsers(filteredUsers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      setLoading(false);
    }
  };

  const handleAddUser = (user) => {
    if (!selectedUsers.some((selected) => selected.email === user.email)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery(""); // Clear search after adding
  };

  const handleRemoveUser = (email) => {
    // Don't allow removing current user
    if (email === currentUserEmail) return;

    setSelectedUsers(selectedUsers.filter((user) => user.email !== email));
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    // Validation
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    if (selectedUsers.length < 2) {
      setError("Please select at least one other user");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const roomData = {
        roomName: roomName.trim(),
        members: selectedUsers.map((user) => user.email),
      };

      // Send request to create room
      const response = await api.post("/rooms/add-room-with-member", roomData);

      setLoading(false);

      // Navigate to chat page on success
      if (response.status === 201 || response.status === 200) {
        toast.success("Chat room created successfully!");
        navigate("/home/chat");
      }
    } catch (err) {
      console.error("Error creating chat room:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create chat room. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden relative z-10 flex flex-col bg-gray-900">
      <Header title="Create New Chat Room" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home/chat")}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to Chats</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
            <button
              className="float-right text-red-200 hover:text-red-100"
              onClick={() => setError(null)}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleCreateRoom}>
            {/* Room Name */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Room Name *
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter a name for this chat room"
                className="w-full rounded-lg bg-gray-800 border-gray-700 border text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3"
                required
              />
            </div>
            {/* Selected Users */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium flex items-center">
                <Users size={16} className="mr-2" />
                Members
              </label>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center bg-gray-700 rounded-full pl-2 pr-1 py-1"
                  >
                    <div className="h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center mr-2">
                      <User size={12} className="text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-200 mr-1">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    {user.email !== currentUserEmail && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.email)}
                        className="h-5 w-5 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 hover:bg-gray-500"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* User Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for users to add"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border-gray-700 border text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-3 text-center text-gray-400">
                      Searching...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-3 text-center text-gray-400">
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = selectedUsers.some(
                        (selected) => selected.email === user.email
                      );

                      return (
                        <div
                          key={user.email}
                          className={`p-3 flex items-center justify-between border-b border-gray-700 last:border-b-0 hover:bg-gray-750 cursor-pointer ${
                            isSelected ? "opacity-50" : ""
                          }`}
                          onClick={() => !isSelected && handleAddUser(user)}
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center mr-3">
                              <User size={16} className="text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-200">
                                {user.name || user.email.split("@")[0]}
                              </h3>
                              <p className="text-xs text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`p-1 rounded-full ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-blue-900"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isSelected) handleAddUser(user);
                            }}
                            disabled={isSelected}
                          >
                            {isSelected ? (
                              <Check size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="px-6 py-3 mr-3 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Create Room
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomPage;
