import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  ListChecks,
  MessageSquare,
  PaperclipIcon,
  Save,
  Trash,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the task by ID from your API
        const response = await api.get(`/tasks/${taskId}`);
        console.log("Task detail:", response.data);
        setTask(response.data);
        setEditedTask(response.data);

        // Fetch comments - in a real app, you would have a separate endpoint
        // This is just placeholder data
        const mockComments = [
          {
            id: "comment1",
            author: "John Doe",
            authorEmail: "john.doe@example.com",
            content: "I've started working on this task. Will update soon.",
            createdAt: "2025-04-25T14:30:00Z",
          },
          {
            id: "comment2",
            author: "Sarah Miller",
            authorEmail: "sarah.miller@example.com",
            content: "Let me know if you need any help with this task.",
            createdAt: "2025-04-26T09:15:00Z",
          },
        ];
        setComments(mockComments);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast.error("Failed to load task details");
        setLoading(false);

        // Fallback to mock data if API fails
        const mockTask = {
          id: taskId,
          taskName: "Design User Interface",
          description:
            "Create wireframes and mockups for the new web application dashboard. Include mobile and desktop versions and prepare a style guide for developers.",
          startDate: "2025-04-15",
          endDate: "2025-04-30",
          status: "In Progress",
          priority: "High",
          assigneeEmail: "designer@example.com",
          assigneeName: "Alex Johnson",
          projectId: "project1",
          projectName: "Web3 Development Platform",
          completionPercentage: 60,
          attachments: [
            { id: "att1", name: "wireframe-v1.pdf", size: "2.4 MB" },
            { id: "att2", name: "style-guide.sketch", size: "8.1 MB" },
          ],
          createdBy: "Project Manager",
          createdAt: "2025-04-10T09:00:00Z",
          updatedAt: "2025-04-22T14:30:00Z",
        };
        setTask(mockTask);
        setEditedTask(mockTask);
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [taskId]);

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
      case "pending":
      case "not started":
        return "bg-gray-500";
      case "delayed":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSaveChanges = async () => {
    try {
      // In a real app, you would send the updated task to your API
      const response = await api.put(`/tasks/${taskId}`, editedTask);
      console.log("Task updated:", response.data);
      setTask(editedTask);
      setIsEditing(false);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      // For demo purposes, we'll still update the UI
      setTask(editedTask);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTask(task);
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

      // For demo purposes, we'll just update the UI
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

  if (!task) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Task Detail" />
        <main className="max-w-5xl mx-auto py-6 px-4 lg:px-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 text-center">
            <X size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Task Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              The task you're looking for doesn't exist or has been removed.
            </p>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              onClick={() => navigate("/home/tasks")}
            >
              Back to Tasks
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Task Detail" />
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
            onClick={() => navigate("/home/tasks")}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Tasks
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
                  Edit Task
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center">
                  <Trash className="mr-2" size={18} />
                  Delete
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Task Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main task information */}
          <motion.div
            className="col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isEditing ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  value={editedTask.taskName}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, taskName: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-white mb-6">
                {task.taskName}
              </h1>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )} bg-opacity-20 border border-opacity-30 ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )} bg-opacity-20 border border-opacity-30 ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority} Priority
                </span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="mr-1" size={16} />
                <span>
                  {formatDate(task.startDate)} - {formatDate(task.endDate)}
                </span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="mr-1" size={16} />
                <span>
                  {calculateRemainingDays(task.endDate)} days remaining
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Description
              </h2>
              {isEditing ? (
                <textarea
                  value={editedTask.description}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                  className="w-full h-40 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">
                  {task.description}
                </p>
              )}
            </div>

            {task.completionPercentage !== undefined && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Progress
                </h2>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${task.completionPercentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  {task.completionPercentage}% Complete
                </div>
              </div>
            )}

            {/* Subtasks Section */}

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <ListChecks className="mr-2" size={20} />
                  Subtasks
                </h2>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  onClick={() => {
                    /* Handle add subtask */
                  }}
                >
                  Add Subtask
                </button>
              </div>
              {task.subtasks && task.subtasks.length > 0 && (
                <ul className="space-y-3">
                  {task.subtasks.map((subtask) => (
                    <li
                      key={subtask.subtaskName}
                      className="flex items-center justify-between bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={subtask.status === "completed"}
                          readOnly
                          className="mr-3 w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <Link
                            to={`/subtask/${encodeURIComponent(
                              subtask.subtaskName
                            )}`}
                            className={`text-white hover:underline ${
                              subtask.status === "completed"
                                ? "line-through text-gray-400"
                                : ""
                            }`}
                          >
                            {subtask.subtaskName}
                          </Link>
                          <div className="text-sm text-gray-300 mt-1">
                            <p>{subtask.description || "No description"}</p>
                            <p>
                              Start:{" "}
                              {subtask.startDate
                                ? new Date(
                                    subtask.startDate
                                  ).toLocaleDateString()
                                : "N/A"}
                              {" | "}
                              End:{" "}
                              {subtask.endDate
                                ? new Date(subtask.endDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            /* Handle edit subtask */
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            /* Handle delete subtask */
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
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
            {/* Project Information */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Project</h2>
              <p className="text-indigo-400 text-lg font-medium">
                {task.projectName}
              </p>
              <button
                className="mt-2 text-gray-400 hover:text-white text-sm flex items-center"
                onClick={() =>
                  navigate(`/home/projects/${task.projectId}/detail`)
                }
              >
                View Project{" "}
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
                  {task.assigneeEmail ? task.assigneeEmail.charAt(0) : "U"}
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">
                    {task.assigneeEmail || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-400">{task.assigneeEmail}</p>
                </div>
              </div>

              {isEditing && (
                <button className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm">
                  <UserPlus className="mr-1" size={16} />
                  Change Assignee
                </button>
              )}
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
                      value={editedTask.startDate}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
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
                      value={editedTask.endDate}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
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
                      {formatDate(task.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Due Date:</span>
                    <span className="text-white">
                      {formatDate(task.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">
                      {Math.ceil(
                        (new Date(task.endDate) - new Date(task.startDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Attachments
                </h2>
                <div className="space-y-3">
                  {task.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex items-center">
                        <PaperclipIcon
                          className="text-indigo-400 mr-2"
                          size={16}
                        />
                        <span className="text-white">{attachment.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {attachment.size}
                      </span>
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <button className="mt-4 flex items-center text-indigo-400 hover:text-indigo-300 text-sm">
                    <PaperclipIcon className="mr-1" size={16} />
                    Add Attachment
                  </button>
                )}
              </div>
            )}

            {/* Creation/Update Information */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Activity
              </h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created by:</span>
                  <span className="text-white">
                    {task.createdBy || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created on:</span>
                  <span className="text-white">
                    {formatDateTime(task.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last updated:</span>
                  <span className="text-white">
                    {formatDateTime(task.updatedAt)}
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

export default TaskDetailPage;
