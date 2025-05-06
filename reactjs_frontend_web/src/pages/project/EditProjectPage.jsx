import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../../components/common/Header";

const EditProjectPage = ({ projectId }) => {
  const [project, setProject] = useState({
    projectName: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    members: [],
    newMember: "",
  });

  const [emailError, setEmailError] = useState("");

  // Fetch existing project data using the projectId when the page loads
  useEffect(() => {
    // Here, replace with actual API call to fetch project details by ID
    // Example:
    // fetchProjectDetails(projectId).then((data) => setProject(data));

    // Simulating a fetched project for demonstration:
    const fetchedProject = {
      projectName: "Project ABC",
      description: "This is a sample project.",
      budget: "5000",
      startDate: "2025-05-01",
      endDate: "2025-12-31",
      priority: "High",
      members: ["member1@example.com", "member2@example.com"],
      newMember: "",
    };

    setProject(fetchedProject);
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleMemberAdd = () => {
    const email = project.newMember.trim();

    if (!email) return;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (project.members.includes(email)) {
      setEmailError("This email is already added");
      return;
    }

    setProject({
      ...project,
      members: [...project.members, email],
      newMember: "",
    });
    setEmailError("");
  };

  const removeMember = (index) => {
    const updatedMembers = [...project.members];
    updatedMembers.splice(index, 1);
    setProject({ ...project, members: updatedMembers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = { ...project };
    delete projectData.newMember; // Remove temporary field before submission
    console.log("Updated Project:", projectData);
    // TODO: Update the project on the server or state management system
  };

  return (
    <div className="flex-1 overflow-auto relative">
      <Header title="Edit Project" />

      <main className="max-w-3xl mx-auto py-10 px-4 lg:px-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl rounded-xl border border-gray-700 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Edit Project
          </h2>

          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                required
                value={project.projectName}
                onChange={handleChange}
                className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter project name"
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
                value={project.description}
                onChange={handleChange}
                className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Describe your project"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Budget ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={project.budget}
                    onChange={handleChange}
                    className="block w-full bg-gray-800 text-white rounded-lg pl-8 pr-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={project.priority}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
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
                  value={project.startDate}
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
                  value={project.endDate}
                  onChange={handleChange}
                  className="block w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Team Members (Email) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Team Members
              </label>
              <div className="flex">
                <input
                  type="email"
                  name="newMember"
                  value={project.newMember}
                  onChange={handleChange}
                  placeholder="Enter member email"
                  className="flex-1 bg-gray-800 text-white rounded-l-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleMemberAdd())
                  }
                />
                <button
                  type="button"
                  onClick={handleMemberAdd}
                  className="bg-indigo-600 px-4 rounded-r-lg hover:bg-indigo-500 transition flex items-center justify-center font-medium"
                >
                  Add
                </button>
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-400">{emailError}</p>
              )}

              {/* Display members */}
              <div className="mt-3 flex flex-wrap gap-2">
                {project.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-indigo-900 bg-opacity-50 text-white px-3 py-2 rounded-full border border-indigo-700"
                  >
                    <span className="max-w-xs truncate">{member}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="ml-2 text-gray-400 hover:text-red-400 transition"
                      aria-label="Remove member"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
              Save Changes
            </button>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default EditProjectPage;
