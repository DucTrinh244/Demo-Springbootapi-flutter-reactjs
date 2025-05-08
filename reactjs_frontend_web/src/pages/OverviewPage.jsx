import { motion } from "framer-motion";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";

import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import api from "../configs/ApiConfig";

const OverviewPage = () => {
  const [summaryOverview, setSummaryOverview] = useState([]);
  useEffect(() => {
    const fetchSummaryOverview = async () => {
      try {
        const response = await api.get("/analytics/overview"); // Gọi API để lấy danh sách dự án
        setSummaryOverview(response.data); // Cập nhật danh sách dự án
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchSummaryOverview(); // Gọi hàm khi component được mount
  }, []);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

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
            icon={Zap}
            value={summaryOverview.totalProjects}
            color="#6366F1"
          />
          <StatCard
            name="Active Projects"
            icon={Users}
            value={summaryOverview.activeProjects}
            color="#8B5CF6"
          />
          <StatCard
            name="Completed Projects"
            icon={ShoppingBag}
            value={summaryOverview.completedProjects}
            color="#EC4899"
          />
          <StatCard
            name="Project Completion Rate"
            icon={BarChart2}
            value={`${summaryOverview.projectCompletionRate}%`}
            color="#10B981"
          />

          {/* Task Stats */}
          <StatCard
            name="Total Tasks"
            icon={Zap}
            value={summaryOverview.totalTasks}
            color="#FF7F50"
          />
          <StatCard
            name="Ongoing Tasks"
            icon={Users}
            value={summaryOverview.ongoingTasks}
            color="#FFD700"
          />
          <StatCard
            name="Completed Tasks"
            icon={ShoppingBag}
            value={summaryOverview.completedTasks}
            color="#4CAF50"
          />
          <StatCard
            name="Task Completion Rate"
            icon={BarChart2}
            value={`${summaryOverview.taskCompletionRate}%`}
            color="#2196F3"
          />
        </motion.div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
