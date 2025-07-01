
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, QrCode, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WhatsAppBotProps {
  language: 'en' | 'oshiwambo';
}

export const WhatsAppBot: React.FC<WhatsAppBotProps> = ({ language }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const botFeatures = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: language === 'en' ? 'Market Updates' : 'Omakundelo Gomakete',
      description: language === 'en' 
        ? 'Real-time market alerts and price changes' 
        : 'Omakundelo gomakete nokukula omakenu'
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      title: language === 'en' ? 'Smart Queries' : 'Omapulo Omalaaye',
      description: language === 'en' 
        ? 'Ask questions in English or Oshiwambo' 
        : 'Pula omapulo mo English ekehe mo Oshiwambo'
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: language === 'en' ? 'Group Insights' : 'Omakusululo Gomakundi',
      description: language === 'en' 
        ? 'Share market insights with your team' 
        : 'Lombwela omakusululo nomakundi gobe'
    }
  ];

  const quickCommands = [
    '/mining - Latest mining sector updates',
    '/housing - Housing market trends',
    '/agriculture - Agricultural forecasts',
    '/green_hydrogen - Green hydrogen developments',
    '/alerts - Set up custom alerts',
    '/help - Full command list'
  ];

  const handleConnectWhatsApp = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate WhatsApp connection process
    setTimeout(() => {
      toast({
        title: "Connected!",
        description: `WhatsApp bot activated for ${phoneNumber}. You'll receive a confirmation message shortly.`,
      });
      setIsConnecting(false);
      setPhoneNumber('');
    }, 2000);
  };

  const openWhatsAppWeb = () => {
    const message = encodeURIComponent(
      language === 'en' 
        ? "Hi! I'd like to connect to the PredictivePulse AI assistant for Namibian market insights."
        : "Wa lalapo! Nda ningi oku hokololwa ko PredictivePulse AI omukwashilonga gomakete gaNamibia."
    );
    window.open(`https://wa.me/264812345678?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Main WhatsApp Bot Card */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
            {language === 'en' ? 'WhatsApp Bot Integration' : 'WhatsApp Bot Omuhokololwa'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Get market insights directly on WhatsApp - available in English and Oshiwambo'
              : 'Tambula omakusululo gomakete ko WhatsApp - mo English nomo Oshiwambo'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">
                {language === 'en' ? 'Connect Your Number' : 'Hokongela Namba Yobe'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder={language === 'en' ? '+264 81 234 5678' : '+264 81 234 5678'}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white flex-1"
              />
              <Button 
                onClick={handleConnectWhatsApp}
                disabled={isConnecting}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isConnecting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  language === 'en' ? 'Connect' : 'Hokongela'
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 border-t border-slate-600"></div>
              <span className="text-xs text-slate-400">
                {language === 'en' ? 'or' : 'kehe'}
              </span>
              <div className="flex-1 border-t border-slate-600"></div>
            </div>

            <Button 
              onClick={openWhatsAppWeb}
              variant="outline"
              className="w-full border-green-500/30 text-green-400 hover:bg-green-500/20"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Open WhatsApp Web' : 'Kolola WhatsApp Web'}
            </Button>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">
              {language === 'en' ? 'Bot Features' : 'Omalanguluko Gobot'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {botFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-slate-700/30 border border-slate-600 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-green-400">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {feature.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Commands */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">
              {language === 'en' ? 'Quick Commands' : 'Omaetelo Omaufiku'}
            </h3>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickCommands.map((command, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {command.split(' - ')[0]}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {command.split(' - ')[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="text-center space-y-4 p-4 bg-slate-900/30 rounded-lg">
            <QrCode className="h-16 w-16 mx-auto text-green-400" />
            <div>
              <p className="text-sm font-medium text-white">
                {language === 'en' ? 'Scan QR Code' : 'Scan QR Code'}
              </p>
              <p className="text-xs text-slate-400">
                {language === 'en' 
                  ? 'Add PredictivePulse Bot to your WhatsApp'
                  : 'Longitha PredictivePulse Bot ko WhatsApp yobe'
                }
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400">
              {language === 'en' ? 'Coming Soon' : 'Oya za'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            {language === 'en' ? 'Bot Statistics' : 'Omaendelo Gobot'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">2.1K</div>
              <div className="text-xs text-slate-400">
                {language === 'en' ? 'Active Users' : 'Aadimi Osho li'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">15.6K</div>
              <div className="text-xs text-slate-400">
                {language === 'en' ? 'Messages Sent' : 'Omeya Osha tum'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">98.2%</div>
              <div className="text-xs text-slate-400">
                {language === 'en' ? 'Uptime' : 'Omvula Yombele'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">4.9</div>
              <div className="text-xs text-slate-400">
                {language === 'en' ? 'Rating' : 'Ombeya'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
