import { motion } from "framer-motion";
import { Eye, File, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/ApiConfig";

const MyCreatedProjectTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = filteredProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(term) ||
        project.category.toLowerCase().includes(term)
    );
    setFilteredProjects(filtered);
  };

  // Lấy danh sách dự án từ API
  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects/created-projects");
      setFilteredProjects(response.data); // Cập nhật danh sách dự án
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime(); // Time difference in milliseconds
    const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    return dayDifference;
  };
  useEffect(() => {
    fetchProjects(); // Gọi hàm khi component được mount
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          My Project Created
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("add")}
          >
            Add Project
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Remaining Days
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
            {filteredProjects.map((project) => (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {project.projectName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.description.length > 30
                    ? project.description.substring(0, 30) + "..."
                    : project.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.projectOwnerId}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {calculateDaysBetween(project.startDate, project.endDate)}{" "}
                  days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {project.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-blue-400 hover:tex  t-blue-300 mr-3 inline-flex items-center"
                    onClick={() =>
                      navigate(`/home/projects/${project.projectId}/detail`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>

                  <button
                    className="text-blue-400 hover:text-blue-300 mr-3 inline-flex items-center"
                    onClick={() => navigate(`/home/file/${project.projectId}`)}
                  >
                    <File className="w-4 h-4 mr-1" />
                    Files
                  </button>
                  {/* <button
                    className="text-blue-400 hover:text-blue-300 mr-3 inline-flex items-center"
                    onClick={() =>
                      navigate(`/home/projects/${project.projectId}/gantt`)
                    }
                  >
                    <File className="w-4 h-4 mr-1" />
                    Gantt
                  </button> */}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MyCreatedProjectTable;
