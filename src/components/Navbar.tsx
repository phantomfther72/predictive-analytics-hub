import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-slate-900 text-xl font-semibold">
              Predictive Pulse
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#industries"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Industries
            </a>
            <a
              href="#testimonials"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Testimonials
            </a>
            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors">
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block px-3 py-2 text-slate-600 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#industries"
              className="block px-3 py-2 text-slate-600 hover:text-slate-900"
            >
              Industries
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 text-slate-600 hover:text-slate-900"
            >
              Testimonials
            </a>
            <button className="w-full text-left px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;