import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  MessageSquare,
  Save,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const SubTaskDetailPage = () => {
  const navigate = useNavigate();
  const { subtaskName } = useParams(); // Using subtaskName from URL
  const [subtask, setSubtask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubtask, setEditedSubtask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchSubtaskDetail = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the subtask by name or ID from your API
        const response = await api.get(
          `/subtasks/${encodeURIComponent(subtaskName)}`
        );
        setSubtask(response.data);
        setEditedSubtask(response.data);

        // Fetch comments - placeholder data
        const mockComments = [
          {
            id: "comment1",
            author: "Jane Smith",
            authorEmail: "jane.smith@example.com",
            content: "Started working on this subtask.",
            createdAt: "2025-04-27T10:00:00Z",
          },
        ];
        setComments(mockComments);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching subtask details:", error);
        toast.error("Failed to load subtask details");
        setLoading(false);

        // Fallback to mock data if API fails
        const mockSubtask = {
          subtaskName: decodeURIComponent(subtaskName),
          description:
            "Complete the initial wireframe for the dashboard component.",
          status: "In Progress",
          startDate: "2025-04-20",
          endDate: "2025-04-28",
          assigneeEmail: "designer@example.com",
          assigneeName: "Alex Johnson",
          taskId: "task1",
          taskName: "Design User Interface",
          createdBy: "Project Manager",
          createdAt: "2025-04-15T09:00:00Z",
          updatedAt: "2025-04-25T14:30:00Z",
        };
        setSubtask(mockSubtask);
        setEditedSubtask(mockSubtask);
        setLoading(false);
      }
    };

    fetchSubtaskDetail();
  }, [subtaskName]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateRemainingDays = (endDateStr) => {
    const endDate = new Date(endDateStr);
    const today = new Date();
    const timeDifference = endDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return dayDifference > 0 ? dayDifference : 0;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "not started":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSaveChanges = async () => {
    try {
      // In a real app, you would send the updated subtask to your API
      await api.put(
        `/subtasks/${encodeURIComponent(subtaskName)}`,
        editedSubtask
      );
      setSubtask(editedSubtask);
      setIsEditing(false);
      toast.success("Subtask updated successfully");
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast.error("Failed to update subtask");
      setSubtask(editedSubtask);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedSubtask(subtask);
    setIsEditing(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // In a real app, you would send the comment to your API
      const comment = {
        id: `comment${comments.length + 1}`,
        author: "Current User",
        authorEmail: "current.user@example.com",
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments([...comments, comment]);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!subtask) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Subtask Detail" />
        <main className="max-w-5xl mx-auto py-6 px-4 lg:px-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 text-center">
            <X size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Subtask Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              The subtask you're looking for doesn't exist or has been removed.
            </p>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              onClick={() => navigate(`/home/tasks/${subtask.taskId}`)}
            >
              Back to Task
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Subtask Detail" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Back button and actions */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition"
            onClick={() => navigate(`/home/tasks/${subtask.taskId}`)}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Task
          </button>

          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center"
                  onClick={handleSaveChanges}
                >
                  <Save className="mr-2" size={18} />
                  Save Changes
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition flex items-center"
                  onClick={handleCancelEdit}
                >
                  <X className="mr-2" size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="mr-2" size={18} />
                  Edit Subtask
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center">
                  <Trash className="mr-2" size={18} />
                  Delete
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Subtask Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main subtask information */}
          <motion.div
            className="col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isEditing ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Subtask Name
                </label>
                <input
                  type="text"
                  value={editedSubtask.subtaskName}
                  onChange={(e) =>
                    setEditedSubtask({
                      ...editedSubtask,
                      subtaskName: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-white mb-6">
                {subtask.subtaskName}
              </h1>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    subtask.status
                  )} bg-opacity-20 border border-opacity-30 ${getStatusColor(
                    subtask.status
                  )}`}
                >
                  {subtask.status}
                </span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="mr-1" size={16} />
                <span>
                  {formatDate(subtask.startDate)} -{" "}
                  {formatDate(subtask.endDate)}
                </span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="mr-1" size={16} />
                <span>
                  {calculateRemainingDays(subtask.endDate)} days remaining
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Description
              </h2>
              {isEditing ? (
                <textarea
                  value={editedSubtask.description}
                  onChange={(e) =>
                    setEditedSubtask({
                      ...editedSubtask,
                      description: e.target.value,
                    })
                  }
                  className="w-full h-40 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">
                  {subtask.description}
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MessageSquare className="mr-2" size={20} />
                Comments
              </h2>

              <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    No comments yet
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                            {comment.author.charAt(0)}
                          </div>
                          <div className="ml-2">
                            <p className="text-white font-medium">
                              {comment.author}
                            </p>
                            <p className="text-xs text-gray-400">
                              {comment.authorEmail}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment form */}
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-white font-medium mb-2">Add a comment</h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                ></textarea>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                  onClick={handleAddComment}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar with additional information */}
          <motion.div
            className="col-span-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {/* Parent Task Information */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Parent Task
              </h2>
              <p className="text-indigo-400 text-lg font-medium">
                {subtask.taskName}
              </p>
              <button
                className="mt-2 text-gray-400 hover:text-white text-sm flex items-center"
                onClick={() => navigate(`/home/tasks/${subtask.taskId}`)}
              >
                View Task{" "}
                <ArrowLeft className="ml-1 transform rotate-180" size={14} />
              </button>
            </div>

            {/* Assignee Information */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Assignee
              </h2>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {subtask.assigneeEmail
                    ? subtask.assigneeEmail.charAt(0)
                    : "U"}
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">
                    {subtask.assigneeName || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {subtask.assigneeEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates & Timeline */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Timeline
              </h2>

              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editedSubtask.startDate}
                      onChange={(e) =>
                        setEditedSubtask({
                          ...editedSubtask,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editedSubtask.endDate}
                      onChange={(e) =>
                        setEditedSubtask({
                          ...editedSubtask,
                          endDate: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">
                      {formatDate(subtask.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Due Date:</span>
                    <span className="text-white">
                      {formatDate(subtask.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">
                      {Math.ceil(
                        (new Date(subtask.endDate) -
                          new Date(subtask.startDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Creation/Update Information */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Activity
              </h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created by:</span>
                  <span className="text-white">
                    {subtask.createdBy || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created on:</span>
                  <span className="text-white">
                    {formatDateTime(subtask.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last updated:</span>
                  <span className="text-white">
                    {formatDateTime(subtask.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SubTaskDetailPage;
