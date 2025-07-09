import React from 'react';
import { Crown, TrendingUp, Target, Shield, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InvestorHub() {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Institutional-Grade Analytics",
      description: "Advanced market modeling with machine learning algorithms tailored for large-scale investments."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Custom Investment Strategies",
      description: "Personalized investment strategies based on your portfolio size and risk tolerance."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Priority Support",
      description: "Dedicated account manager and 24/7 support for all your investment needs."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Exclusive Market Reports",
      description: "Access to institutional-level market reports and insider insights from our research team."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold">Investor Hub</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Welcome to your exclusive investor dashboard. Access institutional-grade analytics, 
          priority insights, and personalized investment strategies.
        </p>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
          Investor Plan Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {feature.icon}
                </div>
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary-variant/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Investment Journey Starts Here</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Leverage our cutting-edge predictive analytics to make informed investment decisions 
            with confidence. Your dedicated team is ready to help you maximize your returns.
          </p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Unlimited</div>
              <div className="text-sm text-muted-foreground">Analytics</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}