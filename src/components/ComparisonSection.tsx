
import React, { useEffect, useState } from 'react';
import { Clock, Zap, TrendingUp, Brain, Users, Target } from 'lucide-react';

interface ComparisonItem {
  traditional: string;
  predictivePulse: string;
  icon: React.ReactNode;
  category: string;
}

const ComparisonSection = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const comparisons: ComparisonItem[] = [
    {
      category: "Data Speed",
      traditional: "Static quarterly reports",
      predictivePulse: "Real-time AI analysis",
      icon: <Clock className="h-6 w-6" />
    },
    {
      category: "Decision Making",
      traditional: "Slow fund managers",
      predictivePulse: "Instant AI algorithms",
      icon: <Brain className="h-6 w-6" />
    },
    {
      category: "Market Access",
      traditional: "Limited fund options",
      predictivePulse: "Build custom AI funds",
      icon: <Target className="h-6 w-6" />
    },
    {
      category: "Performance",
      traditional: "Passive market following",
      predictivePulse: "Dynamic wealth engines",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      category: "Control",
      traditional: "Trust fund managers",
      predictivePulse: "User-driven strategies",
      icon: <Users className="h-6 w-6" />
    },
    {
      category: "Innovation",
      traditional: "Traditional methods",
      predictivePulse: "AI-powered predictions",
      icon: <Zap className="h-6 w-6" />
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll('.comparison-item');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Why Settle for <span className="text-red-400">Old</span> When You Can Have 
            <span className="text-green-400"> Revolutionary</span>?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Traditional investment platforms are stuck in the past. We're building the future.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="space-y-8">
          {comparisons.map((item, index) => (
            <div
              key={index}
              data-index={index}
              className={`comparison-item grid grid-cols-1 lg:grid-cols-3 gap-8 items-center transition-all duration-700 ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Traditional Side */}
              <div className="lg:order-1 p-6 bg-red-950/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg mr-3">
                    {item.icon}
                  </div>
                  <span className="text-red-400 font-bold text-lg">Traditional Funds</span>
                </div>
                <p className="text-slate-300 text-lg">{item.traditional}</p>
                <div className="mt-4 text-red-400 text-sm font-medium">❌ Outdated Approach</div>
              </div>

              {/* VS Indicator */}
              <div className="lg:order-2 flex justify-center">
                <div className="p-4 bg-gradient-to-r from-red-500 to-green-400 rounded-full shadow-lg">
                  <span className="text-white font-bold text-lg">VS</span>
                </div>
              </div>

              {/* Predictive Pulse Side */}
              <div className="lg:order-3 p-6 bg-green-950/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                    {item.icon}
                  </div>
                  <span className="text-green-400 font-bold text-lg">Predictive Pulse</span>
                </div>
                <p className="text-slate-300 text-lg">{item.predictivePulse}</p>
                <div className="mt-4 text-green-400 text-sm font-medium">✅ Revolutionary Technology</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-300 rounded-2xl text-black font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <Zap className="mr-3 h-6 w-6" />
            Experience the Difference
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
