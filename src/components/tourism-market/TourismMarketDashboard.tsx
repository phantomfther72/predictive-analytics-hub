import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MapPin, Calendar, DollarSign, Plane, Hotel, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TourismMarketData } from '@/types/market';

interface TourismMarketDashboardProps {
  data: TourismMarketData[];
}

// Mock data for visualization
const mockTourismData = [
  { month: 'Jan', arrivals: 12500, revenue: 2.8, occupancy: 65 },
  { month: 'Feb', arrivals: 14200, revenue: 3.2, occupancy: 72 },
  { month: 'Mar', arrivals: 16800, revenue: 3.9, occupancy: 78 },
  { month: 'Apr', arrivals: 18500, revenue: 4.2, occupancy: 85 },
  { month: 'May', arrivals: 22100, revenue: 5.1, occupancy: 92 },
  { month: 'Jun', arrivals: 28400, revenue: 6.8, occupancy: 96 },
];

const touristOrigins = [
  { name: 'Germany', value: 28, color: '#0EA5E9' },
  { name: 'South Africa', value: 24, color: '#10B981' },
  { name: 'UK', value: 18, color: '#8B5CF6' },
  { name: 'Netherlands', value: 12, color: '#F59E0B' },
  { name: 'Others', value: 18, color: '#EC4899' },
];

const accommodationTypes = [
  { type: 'Hotels', bookings: 8400, avgRate: 180 },
  { type: 'Lodges', bookings: 5200, avgRate: 320 },
  { type: 'Guesthouses', bookings: 3800, avgRate: 95 },
  { type: 'Camping', bookings: 2100, avgRate: 45 },
];

export const TourismMarketDashboard: React.FC<TourismMarketDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Arrivals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28,400</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +18.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tourism Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6.8M</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +22.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotel Occupancy</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Peak season performance
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Stay Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2 days</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +0.8 days vs last year
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourism Arrivals Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plane className="mr-2 h-5 w-5" />
              Tourism Arrivals & Revenue Trend
            </CardTitle>
            <CardDescription>Monthly visitor arrivals and revenue generation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTourismData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="arrivals" stroke="#0EA5E9" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tourist Origins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Tourist Origins
            </CardTitle>
            <CardDescription>Distribution of tourists by country of origin</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={touristOrigins}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {touristOrigins.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Accommodation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hotel className="mr-2 h-5 w-5" />
            Accommodation Performance
          </CardTitle>
          <CardDescription>Bookings and average rates by accommodation type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accommodationTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="bookings" fill="#0EA5E9" />
              <Bar yAxisId="right" dataKey="avgRate" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tourism Hotspots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Popular Tourism Destinations
          </CardTitle>
          <CardDescription>Most visited attractions and regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Sossusvlei', visitors: 18500, rating: 4.8, category: 'Desert' },
              { name: 'Etosha National Park', visitors: 16200, rating: 4.7, category: 'Wildlife' },
              { name: 'Swakopmund', visitors: 14800, rating: 4.6, category: 'Coastal' },
              { name: 'Fish River Canyon', visitors: 12100, rating: 4.5, category: 'Adventure' },
              { name: 'Windhoek', visitors: 22400, rating: 4.4, category: 'Cultural' },
              { name: 'Skeleton Coast', visitors: 8900, rating: 4.9, category: 'Wilderness' },
            ].map((destination, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{destination.name}</div>
                  <div className="text-sm text-muted-foreground">{destination.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{destination.visitors.toLocaleString()}</div>
                  <div className="flex items-center text-sm">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    {destination.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Tourism Patterns</CardTitle>
          <CardDescription>Understanding peak and off-peak tourism seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-green-600">Peak Season</div>
              <div className="text-sm text-muted-foreground">Jun - Sep</div>
              <div className="text-2xl font-bold mt-2">96% Occupancy</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-yellow-600">Shoulder Season</div>
              <div className="text-sm text-muted-foreground">Mar - May, Oct - Nov</div>
              <div className="text-2xl font-bold mt-2">78% Occupancy</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-blue-600">Low Season</div>
              <div className="text-sm text-muted-foreground">Dec - Feb</div>
              <div className="text-2xl font-bold mt-2">58% Occupancy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};