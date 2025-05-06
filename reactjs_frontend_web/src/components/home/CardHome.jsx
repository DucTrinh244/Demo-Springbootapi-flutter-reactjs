const ResponsiveCards = () => {
    const cardsData = [
      { title: "Software Development", subtitle: "PRODUCT & ISSUE TRACKING" },
      { title: "Marketing", subtitle: "PLAN & LAUNCH CAMPAIGNS" },
      { title: "IT", subtitle: "PLAN & TRACK IT PROJECTS" },
      { title: "Design", subtitle: "BUILD CREATIVE WORKFLOWS" },
      { title: "Operations", subtitle: "CREATE CUSTOM PROCESSES" },
    ];
  
    return (
      <section className="px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
        {cardsData.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-xs text-gray-500 uppercase mb-2">{item.subtitle}</p>
            <h2 className="text-lg font-semibold">{item.title}</h2>
          </div>
        ))}
      </section>
    );
  };
  
  export default ResponsiveCards;
  