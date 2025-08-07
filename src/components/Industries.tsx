
import { Home, Leaf, Mountain, Bitcoin, Zap, LineChart, Stethoscope, Landmark, GraduationCap, Wrench } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const industries = [
  {
    icon: Home,
    title: "Housing Markets",
    description:
      "Track property trends, predict market shifts, and identify investment opportunities in real estate.",
    type: "housing" as const,
    route: "/housing-market"
  },
  {
    icon: Leaf,
    title: "Agriculture",
    description:
      "Monitor crop prices, weather impacts, and global agricultural market movements.",
    type: "agriculture" as const,
    route: "/agriculture-market"
  },
  {
    icon: Mountain,
    title: "Mining",
    description:
      "Analyze commodity prices, production costs, and global mining industry trends.",
    type: "mining" as const,
    route: "/mining-market"
  },
  {
    icon: Bitcoin,
    title: "Cryptocurrency",
    description:
      "Stay ahead of crypto market movements with real-time tracking and predictive analysis.",
    type: "cryptocurrency" as const,
    route: "/cryptocurrency-market"
  },
  {
    icon: Zap,
    title: "Green Hydrogen",
    description:
      "Track emerging clean energy innovation, investment trends, and production capacity.",
    type: "green_hydrogen" as const,
    route: "/green-hydrogen-market"
  },
  {
    icon: LineChart,
    title: "Financial Markets",
    description:
      "Monitor global financial markets, stocks, bonds and analyze investment opportunities.",
    type: "financial" as const,
    route: "/financial-market"
  },
  {
    icon: Stethoscope,
    title: "Medical Assets",
    description:
      "Analyze healthcare metrics, hospital capacity, and equipment utilization trends.",
    type: "medical" as const,
    route: "/medical-market"
  },
  {
    icon: Landmark,
    title: "Tourism",
    description:
      "Track arrivals, bookings, and seasonal demand patterns with geospatial overlays.",
    type: "tourism" as const,
    route: "/tourism"
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Analyze enrollment trends, regional infrastructure and literacy rates over time.",
    type: "education" as const,
    route: "/education"
  },
  {
    icon: Wrench,
    title: "Infrastructure",
    description:
      "Monitor project pipelines, investment flows, and development progress by region.",
    type: "infrastructure" as const,
    route: "/infrastructure"
  }
];

const Industries = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndustry = location.pathname.split('/').pop();

  return (
    <section id="industries" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Industries We Serve
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Specialized insights for diverse market sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(industry.route)}
              className={`group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                currentIndustry === industry.type
                  ? "bg-slate-50 ring-2 ring-slate-900/10"
                  : "bg-white"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8">
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-12 rounded-lg text-white flex items-center justify-center ${
                    currentIndustry === industry.type
                      ? "bg-slate-800"
                      : "bg-slate-900"
                  }`}>
                    <industry.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {industry.title}
                  </h3>
                </div>
                <p className="mt-4 text-slate-600">{industry.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
