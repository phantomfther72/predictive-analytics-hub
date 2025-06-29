
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Sparkles, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AIQuery {
  id: string;
  query_text: string;
  response_text: string;
  industry_context?: string;
  region_context?: string;
  confidence_score?: number;
  created_at: string;
}

export const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<AIQuery[]>([]);
  const { toast } = useToast();

  const suggestedQueries = [
    "What are the mining opportunities in Erongo?",
    "How is the housing market performing in Khomas?",
    "What's the forecast for green hydrogen investments?",
    "Which regions have the lowest agricultural risk?",
    "Show me financial trends for the next quarter"
  ];

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsLoading(true);
    try {
      // Mock AI response for now - in production this would call an AI service
      const mockResponse = generateMockResponse(queryText);
      
      const { data, error } = await supabase
        .from('ai_queries')
        .insert({
          query_text: queryText,
          response_text: mockResponse.response,
          confidence_score: mockResponse.confidence,
          industry_context: mockResponse.industry,
          region_context: mockResponse.region
        })
        .select()
        .single();

      if (error) throw error;

      setConversation(prev => [data, ...prev]);
      setQuery('');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('mining') || lowerQuery.includes('erongo')) {
      return {
        response: "The mining sector in Erongo shows strong growth potential with uranium prices rising 15% this quarter. Key opportunities include the Husab Mine expansion and new lithium exploration projects near Swakopmund.",
        confidence: 0.87,
        industry: 'mining',
        region: 'Erongo'
      };
    }
    
    if (lowerQuery.includes('housing') || lowerQuery.includes('khomas')) {
      return {
        response: "Khomas housing market is experiencing steady growth with average property prices up 8.3% year-over-year. The Windhoek metropolitan area shows particular strength in the mid-range housing segment.",
        confidence: 0.82,
        industry: 'housing',
        region: 'Khomas'
      };
    }
    
    if (lowerQuery.includes('hydrogen') || lowerQuery.includes('green')) {
      return {
        response: "Green hydrogen investments are projected to grow 240% over the next 5 years. The Tsau Khaeb National Park project and Hyphen Hydrogen Energy initiative are key drivers of this growth.",
        confidence: 0.91,
        industry: 'green_hydrogen',
        region: 'Karas'
      };
    }
    
    return {
      response: "Based on current market trends and regional analysis, I can provide insights across all 10 key sectors. Could you specify which industry or region you'd like me to focus on?",
      confidence: 0.75,
      industry: null,
      region: null
    };
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-green-400" />
          Ask Pulse AI
        </CardTitle>
        <CardDescription>
          Get AI-powered insights about Namibian market trends and opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about market trends, forecasts, or opportunities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery(query)}
            className="bg-slate-900/50 border-slate-600 text-white"
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleQuery(query)}
            disabled={isLoading || !query.trim()}
            className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Suggested Queries */}
        {conversation.length === 0 && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-400">
              <HelpCircle className="h-4 w-4 mr-1" />
              Try asking:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuery(suggestion)}
                  className="text-xs text-slate-300 border-slate-600 hover:bg-slate-700"
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {conversation.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">You</span>
                </div>
                <p className="text-sm text-slate-300">{item.query_text}</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Pulse AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.confidence_score && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        {Math.round(item.confidence_score * 100)}% confident
                      </Badge>
                    )}
                    {item.industry_context && (
                      <Badge variant="outline" className="text-xs text-slate-400">
                        {item.industry_context}
                      </Badge>
                    )}
                    {item.region_context && (
                      <Badge variant="outline" className="text-xs text-slate-400">
                        {item.region_context}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-200">{item.response_text}</p>
                <div className="text-xs text-slate-500 mt-2">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
