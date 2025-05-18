import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const GanttProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ganttData, setGanttData] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/project-and-task/${id}`);
        setProject(response.data);

        // Transform tasks into Gantt chart data
        const transformedGanttData = response.data.tasks
          .map((task) => ({
            name: task.taskName,
            status: task.status.toLowerCase(), // Chuyển status thành chữ thường để so sánh chính xác
            startDate: new Date(
              task.startDate || response.data.project.startDate
            ).getTime(),
            endDate: new Date(
              task.endDate || response.data.project.endDate
            ).getTime(),
            assignee: task.assigneeEmail,
          }))
          .sort((a, b) => a.startDate - b.startDate);

        setGanttData(transformedGanttData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const getStatusColor = (status) => {
    switch (
      status.toLowerCase() // Chuyển thành chữ thường để so sánh
    ) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-500";
      case "delayed":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="font-bold text-white mb-2">{data.name}</h3>
          <div className="space-y-1">
            <p className="text-gray-300">
              <Clock className="inline-block mr-2 w-4 h-4" />
              Start: {new Date(data.startDate).toLocaleDateString()}
            </p>
            <p className="text-gray-300">
              <Calendar className="inline-block mr-2 w-4 h-4" />
              End: {new Date(data.endDate).toLocaleDateString()}
            </p>
            <p className="text-gray-300">
              <Users className="inline-block mr-2 w-4 h-4" />
              Assignee: {data.assignee}
            </p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                data.status
              )} bg-opacity-20`}
            >
              {data.status}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return <div className="text-white">No project found</div>;
  }

  const projectData = project.project;
  const taskData = project.tasks;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Project Gantt Chart" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Back button */}
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
            Back to Project
          </button>
        </motion.div>

        {/* Project Gantt Chart */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {projectData.projectName} - Gantt Chart
              </h1>
              <p className="text-gray-400">
                Project Timeline and Task Progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 mr-2 rounded-full"></div>
                <span className="text-gray-300 text-sm">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-500 mr-2 rounded-full"></div>
                <span className="text-gray-300 text-sm">In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-gray-500 mr-2 rounded-full"></div>
                <span className="text-gray-300 text-sm">Pending</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ganttData}
                margin={{ left: 100, right: 20, bottom: 20 }}
              >
                <CartesianGrid
                  horizontal
                  vertical={false}
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  type="number"
                  domain={[
                    Math.min(...ganttData.map((d) => d.startDate)),
                    Math.max(...ganttData.map((d) => d.endDate)),
                  ]}
                  tickFormatter={(timestamp) =>
                    new Date(timestamp).toLocaleDateString()
                  }
                />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="startDate"
                  fill="#2563EB"
                  barSize={20}
                  stackId="task"
                  shape={({ x, y, width, height, payload }) => {
                    const statusColors = {
                      completed: "#10B981", // Green
                      "in progress": "#2563EB", // Blue
                      pending: "#6B7280", // Gray
                      delayed: "#FBBF24", // Yellow
                    };

                    return (
                      <rect
                        x={x}
                        y={y}
                        width={Math.max(width, 10)}
                        height={height}
                        fill={
                          statusColors[payload.status.toLowerCase()] ||
                          "#6B7280"
                        }
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Summary */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Total Tasks</span>
                <span className="font-semibold text-white">
                  {taskData.length}
                </span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Completed Tasks</span>
                <span className="font-semibold text-white">
                  {taskData.filter((t) => t.status === "completed").length}
                </span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Pending Tasks</span>
                <span className="font-semibold text-white">
                  {taskData.filter((t) => t.status !== "completed").length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default GanttProjectPage;
