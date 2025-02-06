import { Brain, LineChart, BarChart3, Layout } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: LineChart,
    title: "Real-Time Data Tracking",
    description: "Monitor market movements as they happen with our advanced tracking system.",
    link: "/real-time-tracking",
  },
  {
    icon: Brain,
    title: "AI-Driven Predictions",
    description: "Leverage machine learning algorithms to forecast market trends with precision.",
    link: "/ai-predictions",
  },
  {
    icon: BarChart3,
    title: "Cross-Sector Analytics",
    description: "Analyze data across housing, agriculture, mining, and cryptocurrency markets.",
    link: "/cross-sector",
  },
  {
    icon: Layout,
    title: "User-Friendly Dashboard",
    description: "Access all your insights through our intuitive and customizable interface.",
    link: "/dashboard",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Powerful Features for Market Analysis
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Everything you need to make informed decisions in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;