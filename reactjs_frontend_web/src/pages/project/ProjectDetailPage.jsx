import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Clock,
  Edit2,
  Eye,
  FileText,
  MessageSquare,
  PlusCircle,
  Trash,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/project-and-task/${id}`);
        console.log(response.data);
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const calculateRemainingDays = () => {
    if (!projectData) return 0;

    const endDate = new Date(projectData.endDate);
    const today = new Date();
    const timeDifference = endDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return dayDifference > 0 ? dayDifference : 0;
  };
  // const isCreatedProject =
  //   projectData.projectOwnerId === localStorage.getItem("email");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const calculateTimelineProgress = (startDateStr, endDateStr) => {
    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const now = new Date();

      // Validate dates
      if (isNaN(startDate.getTime()))
        return { progress: 0, error: "Invalid start date" };
      if (isNaN(endDate.getTime()))
        return { progress: 0, error: "Invalid end date" };

      const totalDuration = endDate - startDate;
      const elapsedTime = now - startDate;

      // Handle special cases
      if (totalDuration <= 0) return { progress: 0 }; // Invalid time range
      if (now < startDate) return { progress: 0 }; // Not started yet
      if (now >= endDate) return { progress: 100 }; // Already finished

      // Calculate progress (0-100%)
      const progress = Math.min(
        100,
        Math.round((elapsedTime / totalDuration) * 100)
      );
      return { progress };
    } catch (error) {
      console.error("Error calculating progress:", error);
      return { progress: 0, error: "Calculation error" };
    }
  };

  // Sample data for demonstration (replace with actual data from API)
  const projectData = project.project || {
    id: id,
    projectName: "Web3 Development Platform",
    description:
      "A comprehensive platform for blockchain developers to build, test, and deploy decentralized applications.",
    startDate: "2025-03-15",
    endDate: "2025-06-30",
    status: "In Progress",
    category: "Blockchain",
    projectOwnerId: "hoangductrinh@gmail.com",
    members: [
      "hoangductrinh@gmail.com",
      "hoangductrinh@gmail.com",
      "hoangductrinh@gmail.com",
    ],
    tasks: [
      {
        id: "task1",
        taskName: "Design UI/UX",
        status: "Completed",
        assigneeEmail: "David Chen",
      },
    ],
    discussions: [
      {
        id: "disc1",
        author: "Alex Johnson",
        avatar: "/api/placeholder/40/40",
        date: "2025-04-20",
        content:
          "We need to reconsider the approach for the authentication system. Any thoughts?",
        replies: [
          {
            id: "reply1",
            author: "Sarah Miller",
            avatar: "/api/placeholder/40/40",
            date: "2025-04-20",
            content: "I suggest we use OAuth with Web3 wallet integration.",
          },
        ],
      },
    ],
  };
  const taskData = project.tasks;
  if (!projectData) toast.error("Project not found");

  const progressPercentage = calculateTimelineProgress(
    projectData.startDate,
    projectData.endDate
  ).progress;
  const taskCompleted = () => {
    const tasksuccess = taskData.filter((t) => t.status === "completed").length;
    const alltask = taskData.length;

    const percent = (tasksuccess / alltask) * 100;

    return percent;
  };

  const remainingDays = calculateRemainingDays();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Not Started":
        return "bg-gray-500";
      case "Delayed":
        return "bg-yellow-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Projects" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Back button and actions */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Projects
          </button>
          {projectData.projectOwnerId === localStorage.getItem("email") && (
            <div className="flex space-x-3">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center">
                <Edit2 className="mr-2" size={18} />
                Edit Project
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center">
                <Trash className="mr-2" size={18} />
                Delete
              </button>
            </div>
          )}
        </motion.div>

        {/* Project Header */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {projectData.projectName}
              </h1>
              <p className="text-gray-400 mb-4">{projectData.description}</p>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-gray-300">
                  <Calendar size={16} className="mr-2 text-blue-400" />
                  <span>Start: {formatDate(projectData.startDate)}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar size={16} className="mr-2 text-blue-400" />
                  <span>End: {formatDate(projectData.endDate)}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock size={16} className="mr-2 text-blue-400" />
                  <span>{remainingDays} days remaining</span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      projectData.status
                    )} bg-opacity-20 border border-opacity-30 ${getStatusColor(
                      projectData.status
                    )}`}
                  >
                    {projectData.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="relative h-20 w-20">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-blue-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - progressPercentage / 100)
                    }`}
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl font-bold fill-current text-white"
                  >
                    {progressPercentage}%
                  </text>
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-2">Project Progress</p>
            </div>
          </div>
        </motion.div>

        {/* Project Owner and Team */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Project Owner */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 text-blue-400" size={20} />
              Project Owner
            </h2>
            <div className="flex items-center">
              {/* <img
                src={projectData.projectOwner.avatar}
                alt={projectData.projectOwner.name}
                className="h-12 w-12 rounded-full mr-4"
              /> */}
              <div>
                <h3 className="font-medium text-white">
                  {projectData.projectOwnerId}
                </h3>
                <p className="text-sm text-gray-400">Owner</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="mr-2 text-blue-400" size={20} />
              Team Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectData.members.map((email, index) => (
                <div
                  key={index} // Dùng index làm key nếu không có id
                  className="flex items-center p-3 rounded-lg bg-gray-700 bg-opacity-40"
                >
                  <div className="h-10 w-10 rounded-full mr-3 bg-gray-600 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {email.charAt(0).toUpperCase()}{" "}
                      {/* Hiển thị chữ cái đầu */}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{email}</h3>
                    {/* Bỏ role nếu không có dữ liệu */}
                  </div>
                </div>
              ))}
              {projectData.projectOwnerId === localStorage.getItem("email") && (
                <div
                  className="flex items-center justify-center p-3 rounded-lg bg-gray-700 bg-opacity-20 border border-dashed border-gray-600 cursor-pointer hover:bg-opacity-30 transition"
                  onClick={() => navigate(`/home/projects/${id}/add_member`)}
                >
                  <PlusCircle className="mr-2 text-gray-400" size={18} />
                  <span className="text-gray-400">Add Member</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          className="flex border-b border-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <button
            className={`py-3 px-6 font-medium text-sm transition flex items-center ${
              activeTab === "overview"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <FileText className="mr-2" size={16} />
            Overview
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm transition flex items-center ${
              activeTab === "tasks"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare className="mr-2" size={16} />
            Tasks
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm transition flex items-center ${
              activeTab === "discussions"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("discussions")}
          >
            <MessageSquare className="mr-2" size={16} />
            Discussions
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Description</h3>
                  <p className="text-gray-300">{projectData.description}</p>

                  <h3 className="text-lg font-medium mb-3 mt-6">
                    Key Milestones
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-300">
                        Project Initialization -{" "}
                        {formatDate(projectData.startDate)}
                      </span>
                    </li>

                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-gray-300">
                        Final Delivery - {formatDate(projectData.endDate)}
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Project Status</h3>
                  {projectData.projectOwnerId ===
                    localStorage.getItem("email") && (
                    <div className="bg-gray-700 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Tasks Completed</span>
                        <span className="font-semibold">
                          {
                            taskData.filter((t) => t.status === "completed")
                              .length
                          }
                          /{taskData.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${taskCompleted()}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Timeline Progress</span>
                      <span className="font-semibold">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {projectData.projectOwnerId ===
                    localStorage.getItem("email") && (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Task Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">
                            Completed
                          </span>
                          <span className="text-sm font-medium">
                            {
                              taskData.filter((t) => t.status === "completed")
                                .length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">
                            In Progress
                          </span>
                          <span className="text-sm font-medium">
                            {
                              taskData.filter((t) => t.status === "In Progress")
                                .length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">
                            Not Started
                          </span>
                          <span className="text-sm font-medium">
                            {
                              taskData.filter((t) => t.status === "Pending")
                                .length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Project Tasks</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center">
                  <PlusCircle className="mr-2" size={18} />
                  Add Task
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Assignee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {taskData
                      .filter((task) => {
                        // Nếu là chủ dự án → hiển thị tất cả
                        if (
                          projectData.projectOwnerId ===
                          localStorage.getItem("email")
                        ) {
                          return true;
                        }

                        // Nếu không phải chủ dự án → chỉ hiển thị task được phân công
                        return (
                          task.assigneeEmail === localStorage.getItem("email")
                        );
                      })
                      .map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            {task.taskName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {task.assigneeEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                task.status
                              )} bg-opacity-20 border border-opacity-30 ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <button className="text-indigo-400 hover:text-indigo-300 mr-3 inline-flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button className="text-indigo-400 hover:text-indigo-300 mr-3 inline-flex items-center">
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button className="text-red-400 hover:text-red-300 inline-flex items-center">
                              <Trash className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Discussions Tab */}
          {/* {activeTab === "discussions" && (
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Project Discussions</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center">
                  <PlusCircle className="mr-2" size={18} />
                  New Discussion
                </button>
              </div>

              <div className="space-y-6">
                {projectData.discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <img
                        src={discussion.avatar}
                        alt={discussion.author}
                        className="h-10 w-10 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-white">
                            {discussion.author}
                          </h3>
                          <span className="text-sm text-gray-400">
                            {formatDate(discussion.date)}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-2">
                          {discussion.content}
                        </p>

                        <div className="mt-4 pl-6 border-l border-gray-700 space-y-4">
                          {discussion.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start">
                              <img
                                src={reply.avatar}
                                alt={reply.author}
                                className="h-8 w-8 rounded-full mr-3"
                              />
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium text-white text-sm">
                                    {reply.author}
                                  </h4>
                                  <span className="text-xs text-gray-400 ml-2">
                                    {formatDate(reply.date)}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-sm mt-1">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center">
                          <input
                            type="text"
                            placeholder="Add a reply..."
                            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button className="bg-blue-600 hover:bg-blue-700 text-white ml-2 px-4 py-2 rounded-lg transition">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
