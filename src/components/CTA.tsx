import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
          Ready to Transform Your Market Strategies?
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Join leading companies using Predictive Pulse to stay ahead in the market
        </p>
        <button className="inline-flex items-center px-8 py-3 text-lg font-medium text-slate-900 bg-white rounded-lg hover:bg-slate-50 transition-colors">
          Request a Demo
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default CTA;