import { motion } from "framer-motion";
import { Calendar, CheckSquare, Clock, FileText, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const TaskPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tasks/my-task");
        console.log(response.data);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateRemainingDays = (endDateStr) => {
    const endDate = new Date(endDateStr);
    const today = new Date();
    const timeDifference = endDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return dayDifference > 0 ? dayDifference : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  // Sample task data for demonstration (replace with actual data from API)
  const taskData =
    tasks.length > 0
      ? tasks
      : [
          {
            id: "task1",
            taskName: "Design User Interface",
            description:
              "Create wireframes and mockups for the new web application dashboard",
            startDate: "2025-04-15",
            endDate: "2025-04-30",
            status: "In Progress",
            priority: "High",
            assigneeEmail: "designer@example.com",
            projectId: "project1",
            projectName: "Web3 Development Platform",
          },
          {
            id: "task2",
            taskName: "Backend API Development",
            description:
              "Implement RESTful API endpoints for user authentication",
            startDate: "2025-04-20",
            endDate: "2025-05-10",
            status: "Pending",
            priority: "Medium",
            assigneeEmail: "backend@example.com",
            projectId: "project1",
            projectName: "Web3 Development Platform",
          },
          {
            id: "task3",
            taskName: "Database Schema Design",
            description: "Create efficient schema for PostgreSQL database",
            startDate: "2025-04-10",
            endDate: "2025-04-25",
            status: "Completed",
            priority: "High",
            assigneeEmail: "database@example.com",
            projectId: "project2",
            projectName: "Data Analytics Platform",
          },
        ];

  const filteredTasks =
    filter === "all"
      ? taskData
      : taskData.filter(
          (task) => task.status.toLowerCase() === filter.toLowerCase()
        );

  const taskCounts = {
    all: taskData.length,
    completed: taskData.filter((t) => t.status.toLowerCase() === "completed")
      .length,
    "in progress": taskData.filter(
      (t) => t.status.toLowerCase() === "in progress"
    ).length,
    pending: taskData.filter(
      (t) =>
        t.status.toLowerCase() === "pending" ||
        t.status.toLowerCase() === "not started"
    ).length,
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Tasks" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Header and actions */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white">Task Management</h1>
        </motion.div>

        {/* Task Status Summary */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border ${
              filter === "all" ? "border-blue-500" : "border-gray-700"
            } cursor-pointer`}
            onClick={() => setFilter("all")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">All Tasks</p>
                <h3 className="text-2xl font-bold text-white">
                  {taskCounts.all}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-500 bg-opacity-20 flex items-center justify-center">
                <CheckSquare size={20} className="text-indigo-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border ${
              filter === "completed" ? "border-blue-500" : "border-gray-700"
            } cursor-pointer`}
            onClick={() => setFilter("completed")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <h3 className="text-2xl font-bold text-white">
                  {taskCounts.completed}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                <CheckSquare size={20} className="text-green-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border ${
              filter === "in progress" ? "border-blue-500" : "border-gray-700"
            } cursor-pointer`}
            onClick={() => setFilter("in progress")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <h3 className="text-2xl font-bold text-white">
                  {taskCounts["in progress"]}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <Clock size={20} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border ${
              filter === "pending" ? "border-blue-500" : "border-gray-700"
            } cursor-pointer`}
            onClick={() => setFilter("pending")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <h3 className="text-2xl font-bold text-white">
                  {taskCounts.pending}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-500 bg-opacity-20 flex items-center justify-center">
                <Calendar size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter options */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border border-gray-700 mb-6 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-300 text-sm">Filter:</span>
            <select
              className="bg-gray-700 text-white ml-2 px-3 py-1 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6">
            {filter === "all"
              ? "All Tasks"
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks`}
            ({filteredTasks.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Task Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Deadline
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
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-700 hover:bg-opacity-30 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {task.taskName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {task.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {task.assigneeEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex flex-col">
                        <span>{formatDate(task.endDate)}</span>
                        <span className="text-xs text-gray-400">
                          {calculateRemainingDays(task.endDate)} days left
                        </span>
                      </div>
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
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300 mr-3 inline-flex items-center"
                          onClick={() => navigate(`/home/tasks/${task.id}`)}
                        >
                          <FileText className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-10">
              <CheckSquare size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-gray-300 text-lg mb-2">No tasks found</h3>
              <p className="text-gray-400">
                {filter !== "all"
                  ? `There are no ${filter} tasks available.`
                  : "No tasks available in the system."}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TaskPage;
