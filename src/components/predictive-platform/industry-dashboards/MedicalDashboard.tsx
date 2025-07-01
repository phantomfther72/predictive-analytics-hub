
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Users, Building } from 'lucide-react';
import { useDataPoints, useForecasts } from '@/hooks/usePredictiveData';

interface MedicalDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ language }) => {
  const medicalIndustryId = 'medical';
  const { data: dataPoints = [] } = useDataPoints(medicalIndustryId);
  const { data: forecasts = [] } = useForecasts(medicalIndustryId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-red-500/20 rounded-xl">
          <Heart className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Healthcare Dashboard' : 'Omuti gwOudjemuna'}
          </h1>
          <p className="text-slate-400">Healthcare sector insights and analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Healthcare Facilities</CardDescription>
            <CardTitle className="text-2xl text-white">142</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Building className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Patient Capacity</CardDescription>
            <CardTitle className="text-2xl text-white">2,580</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Users className="h-3 w-3 mr-1" />
              Beds
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Sector Growth</CardDescription>
            <CardTitle className="text-2xl text-white">+6.8%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Annual
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Healthcare Analytics</CardTitle>
          <CardDescription>Medical sector performance and infrastructure analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            Comprehensive healthcare dashboard with facility mapping, capacity analysis, and health outcomes tracking.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
