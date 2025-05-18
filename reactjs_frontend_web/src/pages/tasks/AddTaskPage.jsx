import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const AddTaskPage = () => {
  // Get projectId from URL parameters
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    taskName: "",
    description: "",
    assigneeEmail: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    status: "pending",
    projectId: "",
    subtasks: [],
    newSubtask: {
      subtaskName: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "pending",
    },
  });

  // Update task with projectId from URL params when component mounts
  useEffect(() => {
    if (projectId) {
      setTask((prevTask) => ({
        ...prevTask,
        projectId,
      }));
    }
  }, [projectId]);

  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubtaskChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      newSubtask: { ...task.newSubtask, [name]: value },
    });
  };

  const handleAddSubtask = () => {
    const { subtaskName } = task.newSubtask;

    if (!subtaskName.trim()) {
      return;
    }

    // Add the subtask with the main task's assigneeEmail
    setTask({
      ...task,
      subtasks: [
        ...task.subtasks,
        {
          ...task.newSubtask,
          assigneeEmail: task.assigneeEmail, // Use main task's assigneeEmail
        },
      ],
      newSubtask: {
        subtaskName: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "pending",
      },
    });

    setShowSubtaskForm(false);
  };

  const removeSubtask = (index) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks.splice(index, 1);
    setTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { ...task };
    delete taskData.newSubtask; // Remove temporary field before submission
    const response = await api.post(`/tasks/${projectId}`, taskData);
    if (response.status === 200) {
      // Handle successful task creation
      toast.success("Add task successfully !"); // Optionally, redirect or show a success message
      navigate(`/home/projects/${projectId}/detail`);
    } else {
      // Handle error
      console.error("Error creating task:", response.data);
    }
  };

  const priorityOptions = ["Low", "Medium", "High", "Critical"];

  return (
    <div className="flex-1 overflow-auto relative">
      <Header title="Add New Task" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl rounded-xl border border-gray-700 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Create New Task
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
              {/* Display Project ID (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={task.projectId}
                  readOnly
                  className="block w-full bg-gray-700 text-gray-300 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none transition cursor-not-allowed"
                />
              </div>

              {/* Assignee Email - Shared between main task and subtasks */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Assignee Email
                </label>
                <input
                  type="email"
                  name="assigneeEmail"
                  value={task.assigneeEmail}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter assignee email"
                />
              </div>
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
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status - if needed */}
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
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={task.startDate}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={task.endDate}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-white">Subtasks</h3>
                <button
                  type="button"
                  onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition text-sm flex items-center"
                >
                  {showSubtaskForm ? "Cancel" : "Add Subtask"}
                </button>
              </div>

              {/* Display subtasks */}
              {task.subtasks.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {task.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-medium text-white">
                          {subtask.subtaskName}
                        </h4>
                        {subtask.description && (
                          <p className="text-gray-400 text-sm mt-1">
                            {subtask.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {subtask.assigneeEmail && (
                            <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                              {subtask.assigneeEmail}
                            </span>
                          )}
                          {subtask.status && (
                            <span className="text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded">
                              {subtask.status}
                            </span>
                          )}
                          {subtask.startDate && subtask.endDate && (
                            <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                              {subtask.startDate} to {subtask.endDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubtask(index)}
                        className="text-gray-400 hover:text-red-400 transition"
                        aria-label="Remove subtask"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No subtasks added yet
                </p>
              )}

              {/* Subtask Form - Without Assignee Email field */}
              {showSubtaskForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700 mt-3"
                >
                  <h4 className="font-medium text-white mb-4">New Subtask</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="subtaskName"
                        required
                        value={task.newSubtask.subtaskName}
                        onChange={handleSubtaskChange}
                        className="block w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Enter subtask name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows="2"
                        value={task.newSubtask.description}
                        onChange={handleSubtaskChange}
                        className="block w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Describe this subtask"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={task.newSubtask.startDate}
                          onChange={handleSubtaskChange}
                          className="block w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={task.newSubtask.endDate}
                          onChange={handleSubtaskChange}
                          className="block w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Status for subtask */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={task.newSubtask.status}
                        onChange={handleSubtaskChange}
                        className="block w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Note about shared assignee */}
                    {task.assigneeEmail && (
                      <div className="text-sm text-blue-400 bg-blue-900/30 p-2 rounded border border-blue-800">
                        <span>
                          Subtask will be assigned to: {task.assigneeEmail}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={handleAddSubtask}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition text-sm"
                      >
                        Add Subtask
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              className="py-3 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex-1 md:flex-none md:min-w-32"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-500 hover:to-blue-400 transition flex-1 md:flex-none md:min-w-32 font-medium"
            >
              Create Task
            </button>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default AddTaskPage;
