import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getDisplayName = (path: string) => {
    const displayNames: { [key: string]: string } = {
      dashboard: 'Dashboard',
      terminal: 'Terminal',
      pricing: 'Pricing',
      settings: 'Settings',
      'investor-hub': 'Investor Hub',
      agriculture: 'Agriculture',
      mining: 'Mining',
      housing: 'Housing',
      financial: 'Financial',
      'green-hydrogen': 'Green Hydrogen',
      cryptocurrency: 'Cryptocurrency',
      medical: 'Medical',
      opportunities: 'Opportunities',
      'global-equity': 'Global Equity',
    };
    return displayNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link 
        to="/" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {pathnames.map((path, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">
                {getDisplayName(path)}
              </span>
            ) : (
              <Link 
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {getDisplayName(path)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};