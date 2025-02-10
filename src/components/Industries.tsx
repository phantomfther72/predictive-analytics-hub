
import { Home, Leaf, Mountain, Bitcoin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const industries = [
  {
    icon: Home,
    title: "Housing Markets",
    description:
      "Track property trends, predict market shifts, and identify investment opportunities in real estate.",
    type: "housing" as const,
  },
  {
    icon: Leaf,
    title: "Agriculture",
    description:
      "Monitor crop prices, weather impacts, and global agricultural market movements.",
    type: "agriculture" as const,
  },
  {
    icon: Mountain,
    title: "Mining",
    description:
      "Analyze commodity prices, production costs, and global mining industry trends.",
    type: "mining" as const,
  },
  {
    icon: Bitcoin,
    title: "Cryptocurrency",
    description:
      "Stay ahead of crypto market movements with real-time tracking and predictive analysis.",
    type: "cryptocurrency" as const,
  },
];

const Industries = () => {
  const navigate = useNavigate();

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/dashboard/industry/${industry.type}`)}
              className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-900 text-white flex items-center justify-center">
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
