
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800">
          <AlertTriangle className="h-10 w-10 text-teal-400" />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-slate-300 mb-8">
          The page you're looking for couldn't be found
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
          
          <Button 
            onClick={() => navigate("/dashboard")}
            variant="outline" 
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost" 
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
