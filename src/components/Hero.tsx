
import { useEffect, useRef } from "react";
import { ArrowRight, Play, Globe } from "lucide-react";
import { DemoModeToggle } from "./DemoModeToggle";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 30 : 60;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 197, 94, 0.1)";
        ctx.fill();

        particles.forEach((particle2, j) => {
          if (i === j) return;
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.08 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    const handleResize = () => {
      resize();
      createParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToMarketData = () => {
    const marketDataSection = document.querySelector('#market-data');
    if (marketDataSection) {
      marketDataSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-800" />
      
      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center px-6 py-3 text-sm font-bold text-green-400 bg-green-950/30 border border-green-500/30 rounded-full shadow-lg backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                TotalEnergies Startup Challenge Top 100 • AI-Powered
              </span>
            </div>

            {/* Main headline */}
            <div className="animate-fade-up animation-delay-200">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                Outsmart the Market.
                <br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  Own the Future.
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <div className="animate-fade-up animation-delay-400">
              <p className="text-xl sm:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium">
                AI-powered insights across <span className="text-green-400 font-bold">global equities</span>, oil & gas, agriculture, mining—
                <br className="hidden sm:block" />
                and <span className="text-green-400 font-bold">Namibia's untapped alpha</span>.
              </p>
            </div>

            {/* Demo Mode Toggle */}
            <div className="animate-fade-up animation-delay-500 flex justify-center">
              <DemoModeToggle />
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-up animation-delay-600 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/global-equity')}
                className="group inline-flex items-center px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-green-400 to-emerald-300 rounded-xl shadow-xl hover:shadow-2xl hover:from-green-300 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300/50"
              >
                <Globe className="mr-3 h-6 w-6" />
                Launch Your AI Fund
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button 
                onClick={scrollToMarketData}
                className="group inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-green-400 rounded-xl hover:bg-green-400/10 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300/50"
              >
                <Play className="mr-3 h-6 w-6" />
                Explore Live Dashboards
              </button>
            </div>

            {/* Live signal indicator */}
            <div className="animate-fade-up animation-delay-800">
              <div className="inline-flex items-center px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-400 font-bold text-sm">LIVE SIGNAL</span>
                </div>
                <span className="text-white text-sm">
                  📈 Oil Bull Signal Detected – <span className="text-green-400 font-bold">72% Confidence</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
