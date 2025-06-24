
import React from 'react';
import { ArrowRight, Zap, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-r from-black via-slate-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Quote */}
        <div className="mb-12">
          <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
            "If your money had a mind of its own—
            <br />
            <span className="text-green-400">it would choose Predictive Pulse.</span>"
          </blockquote>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-300 mx-auto rounded-full" />
        </div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Instant AI Funds</h3>
            <p className="text-slate-300 text-sm">Create personalized investment strategies in minutes, not months</p>
          </div>

          <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Global + Local</h3>
            <p className="text-slate-300 text-sm">Access international markets while capturing Namibian opportunities</p>
          </div>

          <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Predictive Edge</h3>
            <p className="text-slate-300 text-sm">AI-powered insights that anticipate market movements before they happen</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            onClick={() => navigate('/global-equity')}
            size="lg"
            className="bg-gradient-to-r from-green-400 to-emerald-300 text-black font-bold px-8 py-4 text-lg hover:from-green-300 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <Zap className="mr-3 h-6 w-6" />
            Launch Demo
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>

          <Button
            onClick={() => navigate('/dashboard')}
            size="lg"
            variant="outline"
            className="border-2 border-green-400 text-green-400 hover:bg-green-400/10 font-bold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Investing
          </Button>
        </div>

        {/* Risk Disclaimer */}
        <div className="mt-12 text-xs text-slate-500 max-w-2xl mx-auto">
          <p>
            Investment involves risk. Past performance does not guarantee future results. 
            Predictive Pulse provides educational tools and analysis, not financial advice. 
            Please consult with qualified financial advisors before making investment decisions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
