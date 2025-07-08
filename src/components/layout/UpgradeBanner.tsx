import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeBannerProps {
  onDismiss?: () => void;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ onDismiss }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 mb-6">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
              Upgrade to Pro
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              Unlock advanced analytics, unlimited exports, and priority support
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate('/pricing')}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Upgrade Now
          </Button>
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDismiss}
              className="text-yellow-600 hover:text-yellow-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};