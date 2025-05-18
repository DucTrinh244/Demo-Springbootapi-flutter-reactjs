import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import {
  AlertTriangle,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart";
import MyCreatedProjectTable from "../../components/products/MyCreatedProjectTable";
import MyProductsTable from "../../components/products/MyProductsTable";
import api from "../../configs/ApiConfig";
const ProjectsPage = () => {
  const [summaryProject, setSummaryProject] = useState([]);

  useEffect(() => {
    const fetchSummaryProject = async () => {
      try {
        const response = await api.get("/projects/summary"); // Gọi API để lấy danh sách dự án
        setSummaryProject(response.data); // Cập nhật danh sách dự án
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchSummaryProject(); // Gọi hàm khi component được mount
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Projects" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Projects"
            icon={FileSpreadsheet}
            value={summaryProject.totalProjects}
            color="#6366F1"
          />
          <StatCard
            name="Completed Projects"
            icon={TrendingUp}
            value={summaryProject.completedProjects}
            color="#10B981"
          />
          <StatCard
            name="Overdue Projects"
            icon={AlertTriangle}
            value={summaryProject.overdueProjects}
            color="#F59E0B"
          />
          <StatCard
            name="Upcoming Deadlines"
            icon={Calendar}
            value={summaryProject.upcomingDeadlines}
            color="#EF4444"
          />
        </motion.div>

        <MyProductsTable />
        <MyCreatedProjectTable />

        {/* CHARTS */}
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          {/* <SalesTrendChart /> */}
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};
export default ProjectsPage;
