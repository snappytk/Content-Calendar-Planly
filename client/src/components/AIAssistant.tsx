import { useState, useRef, useEffect } from "react";
import { Brain, Sparkles, Clock, TrendingUp, Target, Lightbulb, Send, MessageCircle, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContentItem } from "@shared/schema";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatProps {
  onSuggestionUse?: (suggestion: any) => void;
}

export function AIAssistant({ onSuggestionUse }: ChatProps = {}) {
  const [activeMode, setActiveMode] = useState("suggestions");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! I\'m your AI assistant. I can help you create content ideas, optimize posting times, and provide insights. What would you like to work on today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: contentItems = [] } = useQuery<ContentItem[]>({
    queryKey: ["/api/content"],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage.toLowerCase());
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const generateAIResponse = (input: string): string => {
    const responses = {
      'content': 'Here are some content ideas based on your audience: "5 Tips for Productivity", "Behind the Scenes Look", "User Success Stories", "Industry Trends Update"',
      'schedule': 'Best posting times are: Social Media (2-4 PM), Email (9-11 AM), Blog (7-9 PM). I recommend scheduling posts when your audience is most active.',
      'analytics': 'Your content performs best on weekdays. Posts with questions get 34% more engagement. Consider adding more video content for higher reach.',
      'help': 'I can help with: \n• Content idea generation\n• Optimal posting times\n• Performance insights\n• Content optimization tips\n• Platform-specific advice',
      'time': 'For maximum engagement, post social content between 2-4 PM, send emails 9-11 AM, and publish blog posts 7-9 PM when your audience is most active.',
      'ideas': 'Here are trending content ideas: How-to tutorials, Customer spotlights, Industry news commentary, Quick tips, Behind-the-scenes content, Q&A sessions, and seasonal topics.',
    };

    for (const [key, response] of Object.entries(responses)) {
      if (input.includes(key)) {
        return response;
      }
    }

    return "I'd be happy to help! I can assist with content ideas, scheduling optimization, analytics insights, and content strategy. What specific area would you like to focus on?";
  };

  const handleSuggestionClick = (suggestion: any) => {
    toast.success(`Added "${suggestion.title}" to your content ideas!`);
    if (onSuggestionUse) {
      onSuggestionUse(suggestion);
    }
  };

  const generateSuggestions = () => {
    const topics = [
      "10 Tips for Remote Work Productivity",
      "Behind the Scenes: Our Team Culture",
      "Customer Success Story Spotlight", 
      "Industry Trends You Should Know",
      "Quick Tutorial: Getting Started",
      "Weekly Roundup: Top Insights",
      "Q&A Session with Our Experts",
      "Product Feature Deep Dive",
      "Community Highlights",
      "Seasonal Content Ideas"
    ];
    
    return topics.slice(0, 5).map((topic, index) => ({
      id: index,
      title: topic,
      platform: ["social", "email", "blog"][index % 3],
      confidence: Math.floor(Math.random() * 20) + 80,
      reasoning: [
        "High engagement potential based on similar content",
        "Trending topic in your industry",
        "Performs well with your audience",
        "Seasonal relevance detected",
        "Competitor analysis shows opportunity"
      ][index % 5]
    }));
  };

  const getOptimalTimes = () => {
    return [
      { platform: "Social Media", time: "2:00 PM - 4:00 PM", engagement: "+23%", reason: "Peak activity hours" },
      { platform: "Email", time: "9:00 AM - 11:00 AM", engagement: "+18%", reason: "Morning check routine" },
      { platform: "Blog", time: "7:00 PM - 9:00 PM", engagement: "+15%", reason: "Evening reading time" }
    ];
  };

  const suggestions = generateSuggestions();
  const optimalTimes = getOptimalTimes();

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          AI Assistant
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMode} onValueChange={setActiveMode} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="suggestions" className="text-xs">Ideas</TabsTrigger>
            <TabsTrigger value="timing" className="text-xs">Times</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">AI Content Suggestions</span>
            </div>
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">{suggestion.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.confidence}% match
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{suggestion.reasoning}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {suggestion.platform}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 text-xs"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="timing" className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Optimal Posting Times</span>
            </div>
            {optimalTimes.map((time, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground">{time.platform}</h4>
                  <span className="text-xs text-green-600 font-medium">{time.engagement}</span>
                </div>
                <p className="text-sm text-foreground mb-1">{time.time}</p>
                <p className="text-xs text-muted-foreground">{time.reason}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="insights" className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Performance Insights</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-1">📊 Content Performance</h4>
                <p className="text-xs text-muted-foreground">Your {contentItems.length > 0 ? contentItems[0]?.platform : 'social'} posts perform 12% better on weekdays</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-1">🎯 Audience Engagement</h4>
                <p className="text-xs text-muted-foreground">Posts with questions get 34% more engagement</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-1">📈 Growth Opportunity</h4>
                <p className="text-xs text-muted-foreground">Consider adding more video content for higher reach</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">AI Chat Assistant</span>
            </div>
            <Card className="h-[300px] flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'ai' && (
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-2 rounded-lg text-xs ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground ml-2'
                              : 'bg-muted text-foreground mr-2'
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <div className="bg-muted p-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about content ideas, timing, or analytics..."
                      className="flex-1 text-xs"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}