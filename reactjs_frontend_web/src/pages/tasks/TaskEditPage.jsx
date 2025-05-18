import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const TaskEditPage = () => {
  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch existing task data using the taskId when the page loads
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch task details:", err);
        setError("Failed to load task data. Please try again later.");
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/tasks/${id}/edit`, task);
      if (response.status === 200) {
        navigate(`/home/tasks/${id}`);
        toast.success("Task updated successfully!");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(`/home/tasks/${id}/detail`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">Loading task data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative">
      <Header title="Edit Task" />

      <main className="max-w-3xl mx-auto py-10 px-4 lg:px-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl rounded-xl border border-gray-700 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Edit Task
          </h2>

          <div className="space-y-6">
            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Task Name
              </label>
              <input
                type="text"
                name="taskName"
                required
                value={task.taskName}
                onChange={handleChange}
                className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter task name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={task.description}
                onChange={handleChange}
                className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Describe your task"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned To */}

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={task.endDate}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={task.startDate}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Assigned To
                </label>
                <input
                  type="email"
                  name="assignedEmail"
                  value={task.assigneeEmail}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Assignee email"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="py-3 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex-1 md:flex-none md:min-w-32"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-500 hover:to-blue-400 transition flex-1 md:flex-none md:min-w-32 font-medium"
            >
              Save Changes
            </button>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default TaskEditPage;
