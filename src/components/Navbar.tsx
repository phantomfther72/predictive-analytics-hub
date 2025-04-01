
import { useState, useEffect } from "react";
import { Menu, X, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent",
        isMobileMenuOpen && "bg-white/95 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                Predictive Pulse
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleHomeClick}
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="font-medium">Home</span>
            </button>
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
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-700 to-teal-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors touch-target"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with improved animation and styling */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen 
            ? "max-h-[80vh] opacity-100 border-t border-slate-100 shadow-lg" 
            : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-4 py-3 space-y-2 bg-white">
          <button
            onClick={handleHomeClick}
            className="flex items-center w-full px-4 py-3 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors touch-target"
          >
            <Home className="h-5 w-5 mr-3" />
            <span className="font-medium">Home</span>
          </button>
          <a
            href="#features"
            className="block px-4 py-3 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors touch-target"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="font-medium">Features</span>
          </a>
          <a
            href="#industries"
            className="block px-4 py-3 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors touch-target"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="font-medium">Industries</span>
          </a>
          <a
            href="#testimonials"
            className="block px-4 py-3 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors touch-target"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="font-medium">Testimonials</span>
          </a>
          <div className="pt-2 pb-3">
            <button 
              onClick={() => {
                navigate('/dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 px-4 bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-medium touch-target"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
