import { motion } from "framer-motion";
import { Eye, File } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/ApiConfig";

const MyProductsTable = () => {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách dự án từ API
  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects/my-project");
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
        <h2 className="text-xl font-semibold text-gray-100">My Project</h2>
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
                </td>{" "}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-blue-400 hover:text-blue-300 mr-3 inline-flex items-center"
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
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MyProductsTable;
