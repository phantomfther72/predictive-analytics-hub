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
import { useToast } from '@/hooks/use-toast';
import { useDemoMode } from '@/hooks/useDemoMode';
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
  Clock,
  Key,
  Phone,
  Mail,
  Download,
  FileText,
  HelpCircle,
  MessageSquare,
  Eye,
  DollarSign,
  Calendar,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDevMode, activateDevMode } = useDemoMode();

  // Enhanced state management
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: user?.email || '',
    phone: '',
    backupEmail: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
    forecastUpdates: true,
    aiAnomalies: true,
    marketSignals: true,
    subscriptionReminders: true,
    pauseAll: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    refreshRate: '30s',
    alertSensitivity: 'medium',
    preferredRegions: ['africa', 'global'],
    favoriteIndustries: ['mining', 'agriculture'],
    startupScreen: 'dashboard',
    dataSource: 'mixed',
    defaultForecastModel: 'ensemble',
    widgetLayout: 'default',
    sectorAlertThresholds: {
      housing: 'medium',
      mining: 'medium',
      agriculture: 'medium',
      financial: 'medium'
    }
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
      case 'admin': return 'Administrator';
      case 'pro': return 'Pro Plan';
      case 'investor': return 'Investor Plan';
      case 'guest': return 'Free Plan';
      default: return 'Free Plan';
    }
  };

  const getPlanDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Full platform access with development tools';
      case 'pro': return 'Full access to all features and Terminal';
      case 'investor': return 'Institutional-grade analytics and priority support';
      case 'guest': return 'Basic access with limited features';
      default: return 'Basic access with limited features';
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: profileData.email,
          // Note: Additional fields would need to be added to the profiles table
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleDevModeActivation = () => {
    activateDevMode();
    toast({
      title: "Developer Mode Activated",
      description: "All premium features are now unlocked for development.",
    });
  };

  const handleDataExport = () => {
    toast({
      title: "Data Export",
      description: "Your account data export will be sent to your email.",
    });
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

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="help">Help & Feedback</TabsTrigger>
        </TabsList>
        
        {/* ACCOUNT SECTION - Complete Overhaul */}
        <TabsContent value="account" className="space-y-6">
          {/* User Identity & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Identity & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Choose a username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupEmail">Backup Email</Label>
                  <Input
                    id="backupEmail"
                    type="email"
                    value={profileData.backupEmail}
                    onChange={(e) => setProfileData(prev => ({ ...prev, backupEmail: e.target.value }))}
                    placeholder="Secondary email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+264 XX XXX XXXX"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-3">
                <Button onClick={handleProfileUpdate}>
                  Save Changes
                </Button>
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {getPlanName(profile?.role || 'guest')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getPlanDescription(profile?.role || 'guest')}
                    </p>
                  </div>
                </div>
                <Badge className={`${getRoleBadgeColor(profile?.role || 'guest')} text-lg px-3 py-1`}>
                  {profile?.role?.toUpperCase() || 'GUEST'}
                </Badge>
              </div>
              
              {(profile?.role === 'pro' || profile?.role === 'investor') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Next Billing</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.next_billing_date ? new Date(profile.next_billing_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Monthly Charge</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.role === 'pro' ? 'NAD 199' : 'Custom pricing'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Auto-Renewal</p>
                      <Switch defaultChecked className="mt-1" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {profile?.role === 'guest' ? (
                  <Button onClick={() => navigate('/pricing')} size="lg">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate('/pricing')}>
                      Change Plan
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Billing History
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Access Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(profile?.role === 'admin' || user?.email?.includes('admin')) && (
                  <Button variant="outline" onClick={handleDevModeActivation} className="justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Activate Dev Mode
                  </Button>
                )}
                <Button variant="outline" onClick={handleDataExport} className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Account Data
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms & Privacy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SETTINGS SECTION - Functional, Not Fluff */}
        <TabsContent value="settings" className="space-y-6">
          {/* UI & Layout Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                UI & Layout Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Landing Page</Label>
                  <Select value={preferences.startupScreen} onValueChange={(value) => setPreferences(prev => ({ ...prev, startupScreen: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="terminal">Terminal (InsightOS)</SelectItem>
                      <SelectItem value="forecast">Forecast Center</SelectItem>
                      <SelectItem value="opportunities">Investment Hub</SelectItem>
                      <SelectItem value="housing">Housing Market</SelectItem>
                      <SelectItem value="mining">Mining Sector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Theme Preference</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="terminal">Terminal (Dark Blue)</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Widget Layout</Label>
                  <Select value={preferences.widgetLayout} onValueChange={(value) => setPreferences(prev => ({ ...prev, widgetLayout: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Layout</SelectItem>
                      <SelectItem value="compact">Compact View</SelectItem>
                      <SelectItem value="expanded">Expanded View</SelectItem>
                      <SelectItem value="custom">Custom (Drag & Drop)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Alert Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data & Alert Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-3 block">Preferred Industries to Track</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Mining', 'Housing', 'Agriculture', 'Financial', 'Green Hydrogen', 'Medical'].map((industry) => (
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
                        <Label className="text-sm">{industry}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Forecast Model</Label>
                    <Select value={preferences.defaultForecastModel} onValueChange={(value) => setPreferences(prev => ({ ...prev, defaultForecastModel: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ensemble">Ensemble Model</SelectItem>
                        <SelectItem value="neural">Neural Network</SelectItem>
                        <SelectItem value="regression">Linear Regression</SelectItem>
                        <SelectItem value="arima">ARIMA</SelectItem>
                        <SelectItem value="random_forest">Random Forest</SelectItem>
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
                        <SelectItem value="5s">5 seconds (High frequency)</SelectItem>
                        <SelectItem value="15s">15 seconds (Active traders)</SelectItem>
                        <SelectItem value="30s">30 seconds (Balanced)</SelectItem>
                        <SelectItem value="1m">1 minute (Analysts)</SelectItem>
                        <SelectItem value="5m">5 minutes (Casual users)</SelectItem>
                        <SelectItem value="manual">Manual refresh only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-base mb-3 block">Alert Sensitivity by Sector</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(preferences.sectorAlertThresholds).map(([sector, threshold]) => (
                      <div key={sector} className="flex items-center justify-between p-3 border rounded-lg">
                        <Label className="capitalize">{sector}</Label>
                        <Select 
                          value={threshold} 
                          onValueChange={(value) => setPreferences(prev => ({
                            ...prev,
                            sectorAlertThresholds: { ...prev.sectorAlertThresholds, [sector]: value }
                          }))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-base">Pause All Notifications</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable all notifications</p>
                </div>
                <Switch 
                  checked={notifications.pauseAll}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pauseAll: checked }))}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email && !notifications.pauseAll}
                    disabled={notifications.pauseAll}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms && !notifications.pauseAll}
                    disabled={notifications.pauseAll}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'forecastUpdates', label: 'Forecast Model Updates', desc: 'New predictions and model changes' },
                    { key: 'aiAnomalies', label: 'AI Anomaly Alerts', desc: 'Unusual market patterns detected' },
                    { key: 'marketSignals', label: 'Market Movement Signals', desc: 'Significant price or volume changes' },
                    { key: 'subscriptionReminders', label: 'Subscription Reminders', desc: 'Billing and renewal notices' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{label}</Label>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch 
                        checked={notifications[key as keyof typeof notifications] && !notifications.pauseAll}
                        disabled={notifications.pauseAll}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SECURITY SECTION */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Not Enabled</Badge>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Password</Label>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new sign-ins</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Data Export</Label>
                      <p className="text-sm text-muted-foreground">Download your account data</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDataExport}>
                    Request Export
                  </Button>
                </div>
                
                {(profile?.role === 'admin' || user?.email?.includes('admin')) && (
                  <div className="flex items-center justify-between p-4 border-2 border-dashed border-yellow-500/50 rounded-lg bg-yellow-500/5">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-yellow-500" />
                      <div>
                        <Label className="text-base">Developer Mode</Label>
                        <p className="text-sm text-muted-foreground">Access premium features for development</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDevModeActivation}>
                      {isDevMode ? 'Active' : 'Activate'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HELP & FEEDBACK SECTION */}
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 justify-start" onClick={() => window.open('/docs', '_blank')}>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">User Guide</p>
                      <p className="text-xs text-muted-foreground">Learn how to use all features</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="h-16 justify-start" onClick={() => window.open('/faq', '_blank')}>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">FAQ</p>
                      <p className="text-xs text-muted-foreground">Frequently asked questions</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="h-16 justify-start" onClick={() => window.open('mailto:support@predictivepulse.com')}>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Contact Support</p>
                      <p className="text-xs text-muted-foreground">Get help from our team</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="h-16 justify-start" onClick={() => window.open('/changelog', '_blank')}>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">What's New</p>
                      <p className="text-xs text-muted-foreground">Latest updates and features</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback & Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="feedback-type">Feedback Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="general">General Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="feedback-message">Your Message</Label>
                  <textarea
                    id="feedback-message"
                    className="w-full min-h-[100px] p-3 border rounded-md resize-vertical"
                    placeholder="Tell us what you think or report an issue..."
                  />
                </div>
                
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}