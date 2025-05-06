// import { motion } from "framer-motion";
// import {
//   Archive,
//   ArrowLeft,
//   Calendar,
//   Check,
//   Clock,
//   Copy,
//   Database,
//   Download,
//   Edit2,
//   ExternalLink,
//   HardDrive,
//   Info,
//   Layers,
//   MapPin,
//   Monitor,
//   Save,
//   Server,
//   Trash,
//   User,
//   Zap,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../../components/common/Header";
// import api from "../../configs/ApiConfig";

// const ResourceDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [resource, setResource] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [usageData, setUsageData] = useState({
//     cpu: 65,
//     memory: 48,
//     storage: 72,
//     network: 35,
//   });

//   useEffect(() => {
//     const fetchResourceDetails = async () => {
//       try {
//         setLoading(true);
//         // Replace with actual API call when available
//         // const response = await api.get(`/resources/${id}`);
//         // setResource(response.data);

//         // Mock data for demonstration
//         setResource({
//           id: id || "res1",
//           resourceName: "Production Database Cluster",
//           description: "Primary PostgreSQL database cluster for production environment with high availability configuration and automated backups. Used for storing user data, transaction records, and application state.",
//           type: "Database",
//           allocatedOn: "2025-03-15",
//           expiryDate: "2026-03-15",
//           status: "Active",
//           location: "us-west-1",
//           projectId: "project1",
//           projectName: "Web3 Development Platform",
//           specs: "8 vCPUs, 32GB RAM, 500GB SSD",
//           allocatedBy: "admin@example.com",
//           ipAddress: "10.0.14.28",
//           environment: "Production",
//           maintenanceWindow: "Sunday, 02:00-04:00 UTC",
//           backupSchedule: "Daily at 01:00 UTC",
//           tags: ["database", "production", "postgres", "high-priority"],
//           accessEndpoint: "db-cluster.example.com:5432",
//           costPerMonth: "$349.99",
//           lastMaintenance: "2025-04-01",
//           notes: "Critical infrastructure component. All changes require approval from database admin team.",
//           metrics: {
//             uptime: "99.998%",
//             responseTime: "4.2ms",
//             connections: 128,
//             throughput: "240 MB/s",
//           },
//           history: [
//             {
//               date: "2025-04-01",
//               event: "Routine maintenance completed",
//               user: "system@example.com",
//             },
//             {
//               date: "2025-03-22",
//               event: "Storage capacity increased from 350GB to 500GB",
//               user: "admin@example.com",
//             },
//             {
//               date: "2025-03-15",
//               event: "Resource provisioned and activated",
//               user: "admin@example.com",
//             },
//           ],
//         });
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching resource details:", error);
//         toast.error("Failed to load resource details");
//         setLoading(false);
//       }
//     };

//     fetchResourceDetails();

//     // Simulate changing usage metrics every 10 seconds
//     const intervalId = setInterval(() => {
//       setUsageData({
//         cpu: Math.floor(Math.random() * 30) + 50, // 50-80%
//         memory: Math.floor(Math.random() * 30) + 40, // 40-70%
//         storage: Math.floor(Math.random() * 20) + 65, // 65-85%
//         network: Math.floor(Math.random() * 40) + 20, // 20-60%
//       });
//     }, 10000);

//     return () => clearInterval(intervalId);
//   }, [id]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getTypeIcon = (type) => {
//     switch (type?.toLowerCase()) {
//       case "database":
//         return <Database size={20} className="text-blue-400 mr-2" />;
//       case "server":
//         return <Server size={20} className="text-green-400 mr-2" />;
//       case "storage":
//         return <HardDrive size={20} className="text-purple-400 mr-2" />;
//       case "archive":
//         return <Archive size={20} className="text-yellow-400 mr-2" />;
//       default:
//         return <Layers size={20} className="text-indigo-400 mr-2" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "active":
//         return "bg-green-500";
//       case "provisioning":
//         return "bg-blue-500";
//       case "inactive":
//         return "bg-gray-500";
//       case "maintenance":
//         return "bg-yellow-500";
//       case "decommissioned":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getProgressColor = (percentage) => {
//     if (percentage < 50) return "bg-green-500";
//     if (percentage < 75) return "bg-yellow-500";
//     return "bg-red-500";
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-auto relative z-10">
//       <Header title={`Resource: ${resource?.resourceName}`} />
//       <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
//         {/* Back button and actions */}
//         <motion.div
//           className="flex justify-between items-center mb-6"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <button
//             onClick={() => navigate("/home/resources")}
//             className="flex items-center text-indigo-400 hover:text-indigo-300 transition"
//           >
//             <ArrowLeft className="mr-2" size={18} />
//             Back to Resources
//           </button>

//           <div className="flex space-x-3">
//             <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center">
//               <Edit2 className="mr-2" size={18} />
//               Edit Resource
//             </button>
//             <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center">
//               <Trash className="mr-2" size={18} />
//               Decommission
//             </button>
//           </div>
//         </motion.div>

//         {/* Resource Overview */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Main details */}
//           <motion.div
//             className="lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 {getTypeIcon(resource?.type)}
//                 <h1 className="text-2xl font-bold text-white">{resource?.resourceName}</h1>
//               </div>
//               <span
//                 className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                   resource?.status
//                 )} bg-opacity-20 border border-opacity-30 ${getStatusColor(resource?.status)}`}
//               >
//                 {resource?.status}
//               </span>
//             </div>

//             <p className="text-gray-300 mb-6">{resource?.description}</p>

//             <div className="border-t border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Resource Details</h3>

//                 <div className="space-y-3">
//                   <div className="flex items-start">
//                     <Layers className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">Type</p>
//                       <p className="text-gray-200">{resource?.type}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <Calendar className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">Allocation Date</p>
//                       <p className="text-gray-200">{formatDate(resource?.allocatedOn)}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <Clock className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">Expiry Date</p>
//                       <p className="text-gray-200">{formatDate(resource?.expiryDate)}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <MapPin className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">Location</p>
//                       <p className="text-gray-200">{resource?.location}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Specifications</h3>

//                 <div className="space-y-3">
//                   <div className="flex items-start">
//                     <Zap className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">Specs</p>
//                       <p className="text-gray-200">{resource?.specs}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <Monitor className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">Environment</p>
//                       <p className="text-gray-200">{resource?.environment}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <User className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">Allocated By</p>
//                       <p className="text-gray-200">{resource?.allocatedBy}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <Info className="text-gray-400 mr-2 mt-0.5 w-4 h-4" />
//                     <div>
//                       <p className="text-gray-400 text-xs">IP Address</p>
//                       <p className="text-gray-200">{resource?.ipAddress}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-gray-400 text-sm uppercase tracking-wider">Access Information</h3>
//                 <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
//                   <ExternalLink size={14} className="mr-1" />
//                   Connect
//                 </button>
//               </div>

//               <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 flex items-center justify-between">
//                 <div className="flex-1">
//                   <p className="text-gray-400 text-xs">Endpoint</p>
//                   <p className="text-gray-200 font-mono">{resource?.accessEndpoint}</p>
//                 </div>
//                 <button className="text-indigo-400 hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-500 hover:bg-opacity-20 transition">
//                   <Copy size={16} />
//                 </button>
//               </div>

//               <div className="mt-6">
//                 <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Tags</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {resource?.tags?.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1 bg-indigo-500 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-full text-xs font-medium text-indigo-300"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
