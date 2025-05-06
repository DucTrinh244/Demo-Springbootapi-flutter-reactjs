import { motion } from "framer-motion";
import {
  Archive,
  CheckSquare,
  Database,
  Edit2,
  FileText,
  Filter,
  HardDrive,
  Layers,
  PlusCircle,
  Server,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

const ResourcePage = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await api.get("/resources/my-resources");
        console.log(response.data);
        setResources(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to load resources");
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

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

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "database":
        return <Database size={16} className="mr-1" />;
      case "server":
        return <Server size={16} className="mr-1" />;
      case "storage":
        return <HardDrive size={16} className="mr-1" />;
      case "archive":
        return <Archive size={16} className="mr-1" />;
      default:
        return <Layers size={16} className="mr-1" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "provisioning":
        return "bg-blue-500";
      case "inactive":
        return "bg-gray-500";
      case "maintenance":
        return "bg-yellow-500";
      case "decommissioned":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Sample resource data for demonstration (replace with actual data from API)
  const resourceData =
    resources.length > 0
      ? resources
      : [
          {
            id: "res1",
            resourceName: "Production Database Cluster",
            description:
              "Primary PostgreSQL database cluster for production environment",
            type: "Database",
            allocatedOn: "2025-03-15",
            expiryDate: "2026-03-15",
            status: "Active",
            location: "us-west-1",
            projectId: "project1",
            projectName: "Web3 Development Platform",
            specs: "8 vCPUs, 32GB RAM, 500GB SSD",
            allocatedBy: "admin@example.com",
          },
          {
            id: "res2",
            resourceName: "Development API Servers",
            description: "API servers for development and testing",
            type: "Server",
            allocatedOn: "2025-03-20",
            expiryDate: "2025-09-20",
            status: "Provisioning",
            location: "us-east-1",
            projectId: "project1",
            projectName: "Web3 Development Platform",
            specs: "4 vCPUs, 16GB RAM, Ubuntu 24.04",
            allocatedBy: "admin@example.com",
          },
          {
            id: "res3",
            resourceName: "Analytics Data Storage",
            description: "S3-compatible storage for analytics data",
            type: "Storage",
            allocatedOn: "2025-02-10",
            expiryDate: "2025-08-10",
            status: "Active",
            location: "eu-central-1",
            projectId: "project2",
            projectName: "Data Analytics Platform",
            specs: "5TB capacity, Standard tier",
            allocatedBy: "admin@example.com",
          },
          {
            id: "res4",
            resourceName: "Legacy Code Archive",
            description: "Archive storage for legacy code and documentation",
            type: "Archive",
            allocatedOn: "2024-12-10",
            expiryDate: "2025-12-10",
            status: "Inactive",
            location: "us-central-1",
            projectId: "project3",
            projectName: "Knowledge Base",
            specs: "2TB capacity, Archive tier",
            allocatedBy: "admin@example.com",
          },
        ];

  const filteredResources =
    filter === "all"
      ? resourceData
      : resourceData.filter(
          (resource) => resource.status.toLowerCase() === filter.toLowerCase()
        );

  const resourceCounts = {
    all: resourceData.length,
    active: resourceData.filter((r) => r.status.toLowerCase() === "active")
      .length,
    provisioning: resourceData.filter(
      (r) => r.status.toLowerCase() === "provisioning"
    ).length,
    inactive: resourceData.filter((r) => r.status.toLowerCase() === "inactive")
      .length,
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Resources" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Header and actions */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white">Resource Management</h1>

          <div className="flex space-x-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center">
              <PlusCircle className="mr-2" size={18} />
              Request Resource
            </button>
          </div>
        </motion.div>

        {/* Resource Status Summary */}
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
                <p className="text-gray-400 text-sm">All Resources</p>
                <h3 className="text-2xl font-bold text-white">
                  {resourceCounts.all}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-500 bg-opacity-20 flex items-center justify-center">
                <Layers size={20} className="text-indigo-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border ${
              filter === "active" ? "border-blue-500" : "border-gray-700"
            } cursor-pointer`}
            onClick={() => setFilter("active")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <h3 className="text-2xl font-bold text-white">
                  {resourceCounts.active}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                <CheckSquare size={20} className="text-green-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border ${
              filter === "provisioning" ? "border-blue-500" : "border-gray-700"
            } cursor-pointer`}
            onClick={() => setFilter("provisioning")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Provisioning</p>
                <h3 className="text-2xl font-bold text-white">
                  {resourceCounts.provisioning}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <Server size={20} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border ${
              filter === "inactive" ? "border-blue-500" : "border-gray-700"
            } cursor-pointer`}
            onClick={() => setFilter("inactive")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inactive</p>
                <h3 className="text-2xl font-bold text-white">
                  {resourceCounts.inactive}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-500 bg-opacity-20 flex items-center justify-center">
                <Archive size={20} className="text-gray-400" />
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
              <option value="all">All Resources</option>
              <option value="active">Active</option>
              <option value="provisioning">Provisioning</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="decommissioned">Decommissioned</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search resources..."
              className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Resources List */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6">
            {filter === "all"
              ? "All Resources"
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Resources`}
            ({filteredResources.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Resource Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Expires
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
                {filteredResources.map((resource) => (
                  <tr
                    key={resource.id}
                    className="hover:bg-gray-700 hover:bg-opacity-30 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {resource.resourceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        {getTypeIcon(resource.type)}
                        {resource.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {resource.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(resource.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          resource.status
                        )} bg-opacity-20 border border-opacity-30 ${getStatusColor(
                          resource.status
                        )}`}
                      >
                        {resource.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500 hover:bg-opacity-20 rounded"
                          onClick={() =>
                            navigate(`/home/resources/${resource.id}`)
                          }
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500 hover:bg-opacity-20 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-10">
              <Layers size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-gray-300 text-lg mb-2">No resources found</h3>
              <p className="text-gray-400">
                {filter !== "all"
                  ? `There are no ${filter} resources available.`
                  : "No resources available in the system."}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ResourcePage;
