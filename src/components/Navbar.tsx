
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent",
        isMobileMenuOpen && "bg-white/95 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-lg sm:text-xl font-semibold text-slate-900">
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
              className="text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-4 py-3 space-y-2 border-t border-slate-100">
          <a
            href="#features"
            className="block px-3 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#industries"
            className="block px-3 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Industries
          </a>
          <a
            href="#testimonials"
            className="block px-3 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Testimonials
          </a>
          <button className="w-full text-left px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
