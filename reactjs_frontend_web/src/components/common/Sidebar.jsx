import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  DollarSign,
  LogOut,
  Menu,
  MessageCircleCode,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/home" },
  {
    name: "Projects",
    icon: ShoppingBag,
    color: "#8B5CF6",
    href: "/home/products",
  },
  { name: "Tasks", icon: ShoppingBag, color: "#8B5CF6", href: "/home/tasks" },
  // { name: "Resource", icon: Box, color: "#8B5CF6", href: "/home/resource" },
  {
    name: "Chats",
    icon: MessageCircleCode,
    color: "#38BDF8",
    href: "/home/chat",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#6EE7B7",
    href: "/home/settings",
  },
  { name: "Sales", icon: DollarSign, color: "#10B981", href: "/home/sales" },
  { name: "Users", icon: Users, color: "#EC4899", href: "/home/users" },

  {
    name: "Orders",
    icon: ShoppingCart,
    color: "#F59E0B",
    href: "/home/orders",
  },
  {
    name: "Analytics",
    icon: TrendingUp,
    color: "#3B82F6",
    href: "/home/analytics",
  },

  {
    name: "Logout",
    icon: LogOut,
    color: "#F87171",
    onClick: (navigate) => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      navigate("/login");
    },
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Khởi tạo hook navigate

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.name} className="mb-2">
              {/* Nếu item có onClick (ví dụ Logout), sẽ không dùng Link */}
              {item.name === "Logout" ? (
                <motion.button
                  onClick={() => item.onClick(navigate)} // Gọi hàm onClick khi logout
                  className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ) : (
                <Link to={item.href}>
                  <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
                    <item.icon
                      size={20}
                      style={{ color: item.color, minWidth: "20px" }}
                    />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
