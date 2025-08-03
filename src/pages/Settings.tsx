import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BackButton } from '@/components/layout/BackButton';
import { 
  User, 
  CreditCard, 
  Settings as SettingsIcon, 
  Crown, 
  Bell, 
  Palette, 
  Zap, 
  Shield,
  Globe,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    alerts: true,
    signalDrops: false,
    marketUpdates: true
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    refreshRate: '30s',
    alertSensitivity: 'medium',
    preferredRegions: ['africa', 'global'],
    favoriteIndustries: ['mining', 'agriculture']
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'investor': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'guest': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlanName = (role: string) => {
    switch (role) {
      case 'pro': return 'Pro Plan';
      case 'investor': return 'Investor Plan';
      case 'guest': return 'Free Plan';
      default: return 'Free Plan';
    }
  };

  const getPlanDescription = (role: string) => {
    switch (role) {
      case 'pro': return 'Full access to all features';
      case 'investor': return 'Institutional-grade analytics and priority support';
      case 'guest': return 'Basic access with limited features';
      default: return 'Basic access with limited features';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BackButton to="/dashboard" />
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Settings & Account</h1>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <div className="mt-1">
                    <Badge className={getRoleBadgeColor(profile?.role || 'guest')}>
                      {profile?.role?.toUpperCase() || 'GUEST'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-sm">{new Date(profile?.created_at || '').toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subscription Status</label>
                  <p className="text-sm capitalize">{profile?.subscription_status || 'inactive'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold">
                      {getPlanName(profile?.role || 'guest')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getPlanDescription(profile?.role || 'guest')}
                    </p>
                  </div>
                </div>
                <Badge className={getRoleBadgeColor(profile?.role || 'guest')}>
                  {profile?.role?.toUpperCase() || 'GUEST'}
                </Badge>
              </div>
              
              {(profile?.role === 'pro' || profile?.role === 'investor') && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next billing date:</span>
                    <span>{profile?.next_billing_date ? new Date(profile.next_billing_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly charge:</span>
                    <span>
                      {profile?.role === 'pro' ? 'NAD 199' : 'Custom pricing'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                {profile?.role === 'guest' ? (
                  <Button onClick={() => navigate('/pricing')} className="flex-1">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => navigate('/pricing')} className="flex-1">
                    Manage Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Terminal Alerts</Label>
                    <p className="text-sm text-muted-foreground">Real-time market alerts in Terminal</p>
                  </div>
                  <Switch 
                    checked={notifications.alerts}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, alerts: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Signal Drops</Label>
                    <p className="text-sm text-muted-foreground">Weekly expert insights digest</p>
                  </div>
                  <Switch 
                    checked={notifications.signalDrops}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, signalDrops: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Market Updates</Label>
                    <p className="text-sm text-muted-foreground">Daily market summary notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.marketUpdates}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketUpdates: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Display & Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="terminal">Terminal (Dark Blue)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data Refresh Rate</Label>
                <Select value={preferences.refreshRate} onValueChange={(value) => setPreferences(prev => ({ ...prev, refreshRate: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5s">5 seconds</SelectItem>
                    <SelectItem value="15s">15 seconds</SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="1m">1 minute</SelectItem>
                    <SelectItem value="5m">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Alert Sensitivity</Label>
                <Select value={preferences.alertSensitivity} onValueChange={(value) => setPreferences(prev => ({ ...prev, alertSensitivity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Major changes only</SelectItem>
                    <SelectItem value="medium">Medium - Balanced alerts</SelectItem>
                    <SelectItem value="high">High - All market movements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional & Industry Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Regions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Africa', 'Global', 'Europe', 'Asia', 'Americas'].map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Switch 
                        checked={preferences.preferredRegions.includes(region.toLowerCase())}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({
                            ...prev,
                            preferredRegions: checked 
                              ? [...prev.preferredRegions, region.toLowerCase()]
                              : prev.preferredRegions.filter(r => r !== region.toLowerCase())
                          }));
                        }}
                      />
                      <Label>{region}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Favorite Industries</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Mining', 'Agriculture', 'Housing', 'Financial', 'Green Hydrogen', 'Medical'].map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Switch 
                        checked={preferences.favoriteIndustries.includes(industry.toLowerCase())}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({
                            ...prev,
                            favoriteIndustries: checked 
                              ? [...prev.favoriteIndustries, industry.toLowerCase()]
                              : prev.favoriteIndustries.filter(i => i !== industry.toLowerCase())
                          }));
                        }}
                      />
                      <Label>{industry}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Change Password</Label>
                  <p className="text-sm text-muted-foreground mb-2">Update your account password</p>
                  <Button variant="outline">Change Password</Button>
                </div>
                <Separator />
                <div>
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground mb-2">Add an extra layer of security</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <Separator />
                <div>
                  <Label className="text-base">Data Export</Label>
                  <p className="text-sm text-muted-foreground mb-2">Download your data and insights</p>
                  <Button variant="outline">Export Data</Button>
                </div>
                <Separator />
                <div>
                  <Label className="text-base text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground mb-2">Permanently delete your account and all data</p>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}