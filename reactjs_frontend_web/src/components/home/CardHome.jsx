import { Briefcase, PenTool, Rocket, Server, Settings } from "lucide-react";

const icons = [Briefcase, Rocket, Server, PenTool, Settings];

const ResponsiveCards = () => {
  const cardsData = [
    { title: "Software Development", subtitle: "Product & Issue Tracking" },
    { title: "Marketing", subtitle: "Plan & Launch Campaigns" },
    { title: "IT", subtitle: "Plan & Track IT Projects" },
    { title: "Design", subtitle: "Build Creative Workflows" },
    { title: "Operations", subtitle: "Create Custom Processes" },
  ];

  return (
    <section className="px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {cardsData.map((item, idx) => {
        const Icon = icons[idx];
        return (
          <div
            key={idx}
            className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
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
  );
};

export default ResponsiveCards;
