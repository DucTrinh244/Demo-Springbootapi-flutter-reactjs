import {
  ArrowRight,
  Briefcase,
  LogIn,
  PenTool,
  Rocket,
  Server,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const icons = [Briefcase, Rocket, Server, PenTool, Settings];

const cardsData = [
  { title: "Software Development", subtitle: "Product & Issue Tracking" },
  { title: "Marketing", subtitle: "Plan & Launch Campaigns" },
  { title: "IT", subtitle: "Plan & Track IT Projects" },
  { title: "Design", subtitle: "Build Creative Workflows" },
  { title: "Operations", subtitle: "Create Custom Processes" },
];

const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Great outcomes <br />
          <span className="font-light text-blue-600">start with Zone Dev</span>
        </h1>

        <p className="text-gray-600 max-w-xl mb-10 text-base md:text-lg">
          The only project management tool you need to plan and track work
          across every team.
        </p>

        <div className="w-full max-w-md space-y-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            <ArrowRight size={18} />
            Sign up
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="flex items-center justify-center gap-2 w-full border border-blue-600 text-blue-600 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>
      </main>

      {/* Responsive Cards */}
      <section className="px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cardsData.map((item, idx) => {
          const Icon = icons[idx];
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                <Icon className="text-blue-600 w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase mb-2 tracking-wide">
                {item.subtitle}
              </p>
              <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default MainContent;
