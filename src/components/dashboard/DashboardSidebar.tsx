
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BarChart3, 
  Table, 
  User, 
  TrendingUp,
  Building2,
  Pickaxe,
  Wheat,
  Droplets,
  DollarSign,
  Briefcase,
  Globe,
  Target,
  Zap
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: Home, label: "Overview", path: "/dashboard" },
    { icon: BarChart3, label: "Charts", path: "/dashboard/charts" },
    { icon: Table, label: "Tables", path: "/dashboard/tables" },
    { icon: Briefcase, label: "Opportunities", path: "/dashboard/opportunities" },
    { 
      icon: Globe, 
      label: "Global Equity", 
      path: "/global-equity",
      isNew: true,
      description: "AI-powered global markets"
    },
  ];

  const industryItems = [
    { icon: TrendingUp, label: "Financial", path: "/dashboard/industry/financial" },
    { icon: Building2, label: "Housing", path: "/dashboard/industry/housing" },
    { icon: Pickaxe, label: "Mining", path: "/dashboard/industry/mining" },
    { icon: Wheat, label: "Agriculture", path: "/dashboard/industry/agriculture" },
    { icon: Droplets, label: "Green Hydrogen", path: "/dashboard/industry/green_hydrogen" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">PredictivePulse</h2>
            <p className="text-xs text-muted-foreground">AI Investment Platform</p>
          </div>
        </div>

        <nav className="space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Dashboard
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive(item.path) && "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.isNew && (
                    <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Industry Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Industries
            </h3>
            <div className="space-y-1">
              {industryItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive(item.path) && "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10"
                onClick={() => navigate("/global-equity")}
              >
                <Zap className="h-4 w-4" />
                Create Fund
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10"
              >
                <DollarSign className="h-4 w-4" />
                View Portfolio
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* User Profile */}
      <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10"
          onClick={() => navigate("/dashboard/profile")}
        >
          <User className="h-4 w-4" />
          Profile & Settings
        </Button>
      </div>
    </aside>
  );
};
