
import { useState, useEffect } from "react";
import { Menu, X, Home, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isSmall = useBreakpoint('sm');

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
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm"
          : "bg-transparent",
        isMobileMenuOpen && "bg-white/98 dark:bg-slate-900/98 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="text-lg sm:text-xl font-display font-semibold text-slate-900 dark:text-white flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                Predictive Pulse
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={handleHomeClick}
              className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="font-medium">Home</span>
            </button>
            <a
              href="#features"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#industries"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Industries
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                Sectors <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/tourism">Tourism</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/education">Education</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/infrastructure">Infrastructure</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/opportunities"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Opportunities
            </Link>
            <Link
              to="/terminal"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Terminal
            </Link>
            <a
              href="#testimonials"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Testimonials
            </a>
            <Link
              to="/pricing"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
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
              className="text-slate-900 dark:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target mobile-interactive"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Improved mobile menu animation and styling */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-100 dark:border-slate-800 shadow-lg"
          >
            <div className="px-3 py-2 space-y-1 bg-white dark:bg-slate-900">
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={handleHomeClick}
                className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
              >
                <Home className="h-5 w-5 mr-3" />
                <span className="font-medium">Home</span>
              </motion.button>
              
              <motion.a
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                href="#features"
                className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Features</span>
              </motion.a>
              
              <motion.a
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                href="#industries"
                className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Industries</span>
              </motion.a>
              
              <motion.a
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                href="#testimonials"
                className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Testimonials</span>
              </motion.a>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="w-full"
              >
                <Link
                  to="/opportunities"
                  className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Opportunities</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <Link
                  to="/tourism"
                  className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Tourism</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="w-full"
              >
                <Link
                  to="/education"
                  className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Education</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full"
              >
                <Link
                  to="/infrastructure"
                  className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Infrastructure</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="w-full"
              >
                <Link
                  to="/terminal"
                  className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Terminal</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="w-full"
              >
                <Link
                  to="/pricing"
                  className="flex w-full items-center px-4 py-3 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors touch-target"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Pricing</span>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-2 pb-3 px-1"
              >
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-3 px-4 bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-medium touch-target"
                >
                  Get Started
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
