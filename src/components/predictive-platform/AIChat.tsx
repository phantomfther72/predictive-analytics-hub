
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Sparkles, Bot, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  industry?: string;
  region?: string;
  confidence?: number;
  sources?: string[];
}

interface AIChatProps {
  language: 'en' | 'oshiwambo';
  selectedIndustry?: string;
  selectedRegion?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  language, 
  selectedIndustry, 
  selectedRegion 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const contextualSuggestions = [
    {
      text: language === 'en' ? "What's the uranium mining outlook?" : "Omukumo gwouranium mining ngapi?",
      context: { industry: 'mining', region: 'Erongo' }
    },
    {
      text: language === 'en' ? "Housing market trends in Windhoek?" : "Ozongombe zonganda mo Windhoek?",
      context: { industry: 'housing', region: 'Khomas' }
    },
    {
      text: language === 'en' ? "Green hydrogen investment opportunities?" : "Omapangelo gokukula hydrogen omuverde?",
      context: { industry: 'green_hydrogen', region: 'Erongo' }
    },
    {
      text: language === 'en' ? "Agricultural risks this season?" : "Oomapya goulimi momuvaka guno?",
      context: { industry: 'agriculture', region: 'Hardap' }
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: language === 'en' 
          ? "Hello! I'm Pulse AI, your Namibian market intelligence assistant. I can help you analyze trends, forecasts, and opportunities across all industries. What would you like to know?"
          : "Wa lalapo! Oshi Pulse AI, omukwashilonga gwomaperekero gaNamibia. Ndi kala oku li kwata oomakusululo, oompwiyo nomakululo komaimbuto gonke. Taka li ningi oku pula?",
        timestamp: new Date(),
        confidence: 1.0
      };
      setMessages([welcomeMessage]);
    }
  }, [language, messages.length]);

  const generateAIResponse = (userQuery: string, context?: any) => {
    const responses = {
      uranium: {
        en: "Based on current market analysis, Namibia's uranium sector shows strong growth potential with a 12.5% predicted increase over the next 12 months. Key drivers include global nuclear energy demand and supply constraints. The Husab and Rössing mines are positioned to benefit significantly from this trend.",
        oshiwambo: "Okupya omweelo gwomakete gwaino, uranium mo Namibia oya lombwela unene nokukula 12.5% momyezi 12 yilayo. Omakusululo omapandulwa gaaye nuclear energy noukwafele gwomakete."
      },
      housing: {
        en: "Windhoek's housing market shows moderate growth with average prices predicted to rise 4.8% annually. However, affordability challenges may reduce active listings by 2.3%. Prime areas like Klein Windhoek and Ludwigsdorf show strongest performance.",
        oshiwambo: "Omakete gwozonganda mo Windhoek owa lombwela pokati, omakenu gaayo gakala oku kula 4.8% omuvaka gumwe. Ihe oomapya goukwafele omakenu gakala oku honga omakululo."
      },
      agriculture: {
        en: "Agricultural outlook varies by region. Central areas show promise with 15.2% growth predicted for maize production, driven by improved rainfall patterns. However, drought risks remain elevated in southern regions.",
        oshiwambo: "Oulimi otwa ninako omakululo otwa niningwa. Ombipi dzokati odza lombwela unene nokukula 15.2% koulimi gwamahango, okupya omvula nkene."
      },
      general: {
        en: "I can provide insights across mining, housing, agriculture, medical, financial, and green hydrogen sectors. Could you specify which industry or region interests you most?",
        oshiwambo: "Ndi kala oku ningila pamwe noulimi, ozonganda, omaimbuto gondjino, omakwatakala nohydrogen omuverde. Taka ningi ombipi ekudheno?"
      }
    };

    const query = userQuery.toLowerCase();
    let responseKey = 'general';
    let industry = '';
    let region = '';

    if (query.includes('uranium') || query.includes('mining')) {
      responseKey = 'uranium';
      industry = 'mining';
      region = 'Erongo';
    } else if (query.includes('housing') || query.includes('windhoek') || query.includes('property')) {
      responseKey = 'housing';
      industry = 'housing';
      region = 'Khomas';
    } else if (query.includes('agriculture') || query.includes('farming') || query.includes('crop')) {
      responseKey = 'agriculture';
      industry = 'agriculture';
      region = 'Hardap';
    }

    return {
      content: responses[responseKey as keyof typeof responses][language],
      industry,
      region,
      confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      sources: ['Namibian Chamber of Mines', 'Bank of Namibia', 'Ministry of Agriculture']
    };
  };

  const handleSendMessage = async (query?: string) => {
    const messageText = query || inputValue.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Generate AI response
      const aiResponse = generateAIResponse(messageText, { selectedIndustry, selectedRegion });
      
      // Store in database
      const { error } = await supabase
        .from('ai_queries')
        .insert({
          query_text: messageText,
          response_text: aiResponse.content,
          industry_context: aiResponse.industry || selectedIndustry,
          region_context: aiResponse.region || selectedRegion,
          confidence_score: aiResponse.confidence
        });

      if (error) console.warn('Failed to store query:', error);

      // Add AI response to messages
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        industry: aiResponse.industry,
        region: aiResponse.region,
        confidence: aiResponse.confidence,
        sources: aiResponse.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-green-400" />
          {language === 'en' ? 'Pulse AI Assistant' : 'Pulse AI Omukwashilonga'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Intelligent insights for Namibian markets' 
            : 'Omakusululo omalaaye gomakete gaNamibia'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-green-500/20 border border-green-500/30 text-green-50'
                      : 'bg-slate-700/50 border border-slate-600 text-slate-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`p-1 rounded-full ${
                      message.type === 'user' 
                        ? 'bg-green-500/30' 
                        : 'bg-blue-500/30'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Message metadata */}
                      {message.type === 'assistant' && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(message.confidence * 100)}% confident
                            </Badge>
                          )}
                          {message.industry && (
                            <Badge variant="outline" className="text-xs">
                              {message.industry}
                            </Badge>
                          )}
                          {message.region && (
                            <Badge variant="outline" className="text-xs">
                              {message.region}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Message actions */}
                      <div className="mt-2 flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {message.type === 'assistant' && (
                          <>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <span className="text-xs text-slate-500 ml-2">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-full bg-blue-500/30">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggestions (only show when no messages) */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              {language === 'en' ? 'Try asking:' : 'Pula opo:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {contextualSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(suggestion.text)}
                  className="text-xs text-slate-300 border-slate-600 hover:bg-slate-700"
                  disabled={isLoading}
                >
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            placeholder={language === 'en' 
              ? "Ask about market trends, forecasts, or opportunities..." 
              : "Pula omakusululo, oompwiyo nokehe omakaululo..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            className="bg-slate-900/50 border-slate-600 text-white"
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
