import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Users, Eye, Heart, Share2, BarChart3, Calendar, Download, Brain, Sparkles, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@/hooks/use-subscription";
import type { ContentItem } from "@shared/schema";

export default function Analytics() {
  const { data: contentItems = [] } = useQuery<ContentItem[]>({
    queryKey: ["/api/content"],
  });
  const { isPremium, hasAccess } = useSubscription();

  // Calculate real metrics from content data
  const totalPosts = contentItems.length;
  const publishedPosts = contentItems.filter(item => item.status === 'published').length;
  const scheduledPosts = contentItems.filter(item => item.status === 'scheduled').length;
  const draftPosts = contentItems.filter(item => item.status === 'draft').length;

  const platformCounts = contentItems.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const thisMonthPosts = contentItems.filter(item => 
    new Date(item.scheduledDate) >= thisMonth
  ).length;

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  lastMonth.setDate(1);
  const lastMonthEnd = new Date(thisMonth);
  lastMonthEnd.setDate(0);
  const lastMonthPosts = contentItems.filter(item => {
    const itemDate = new Date(item.scheduledDate);
    return itemDate >= lastMonth && itemDate <= lastMonthEnd;
  }).length;

  const monthlyGrowth = lastMonthPosts > 0 ? ((thisMonthPosts - lastMonthPosts) / lastMonthPosts * 100).toFixed(1) : "0";

  const metrics = [
    { label: "Total Posts", value: totalPosts.toString(), change: `+${monthlyGrowth}%`, trend: monthlyGrowth >= "0" ? "up" : "down" },
    { label: "Published", value: publishedPosts.toString(), change: `${((publishedPosts/totalPosts)*100).toFixed(1)}%`, trend: "up" },
    { label: "Scheduled", value: scheduledPosts.toString(), change: `${((scheduledPosts/totalPosts)*100).toFixed(1)}%`, trend: "up" },
    { label: "This Month", value: thisMonthPosts.toString(), change: `${monthlyGrowth}%`, trend: monthlyGrowth >= "0" ? "up" : "down" }
  ];

  const platformData = [
    { 
      platform: "Social Media", 
      posts: platformCounts["social"] || 0, 
      engagement: Math.floor(Math.random() * 20) + 80, 
      reach: `${((platformCounts["social"] || 0) * 1.2).toFixed(1)}K`, 
      color: "bg-blue-500" 
    },
    { 
      platform: "Email", 
      posts: platformCounts["email"] || 0, 
      engagement: Math.floor(Math.random() * 15) + 75, 
      reach: `${((platformCounts["email"] || 0) * 1.5).toFixed(1)}K`, 
      color: "bg-green-500" 
    },
    { 
      platform: "Blog", 
      posts: platformCounts["blog"] || 0, 
      engagement: Math.floor(Math.random() * 10) + 85, 
      reach: `${((platformCounts["blog"] || 0) * 2.1).toFixed(1)}K`, 
      color: "bg-purple-500" 
    }
  ];

  const topPosts = contentItems
    .slice(0, 3)
    .map(item => ({
      title: item.title,
      platform: item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
      engagement: Math.floor(Math.random() * 20) + 80,
      views: `${(Math.random() * 3 + 1).toFixed(1)}K`
    }));

  // Premium gate for non-subscribers
  if (!hasAccess('analytics')) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Link href="/app">
                  <Button variant="ghost" size="sm" className="transition-all hover:scale-105">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Planner
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                  <Badge variant="secondary" className="mt-1">Premium Feature</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Gate */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-6"></div>
              <Card className="relative border-primary/50 bg-gradient-to-b from-primary/5 to-transparent">
                <CardContent className="p-12">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Lock className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Premium Analytics Dashboard
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Unlock detailed insights, performance metrics, and AI-powered recommendations to grow your audience.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Performance Metrics</h3>
                      <p className="text-sm text-muted-foreground">Track engagement, reach, and growth</p>
                    </div>
                    <div className="text-center">
                      <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">AI Insights</h3>
                      <p className="text-sm text-muted-foreground">Smart recommendations for better content</p>
                    </div>
                    <div className="text-center">
                      <Download className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Export Reports</h3>
                      <p className="text-sm text-muted-foreground">Download detailed analytics reports</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link href="/subscription">
                      <Button size="lg" className="px-8 py-3">
                        <Crown className="h-5 w-5 mr-2" />
                        Upgrade to Premium - $5/month
                      </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Cancel anytime • Free trial ends at month end
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="transition-all hover:scale-105">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Planner
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                <Badge variant="default" className="mt-1">Premium Active</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="transition-all hover:scale-105">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
              <Button variant="outline" size="sm" className="transition-all hover:scale-105">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendations */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">📈 Optimal Posting Times</h4>
                <p className="text-muted-foreground">Post social content at 2-4 PM for 23% higher engagement</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">🎯 Content Suggestions</h4>
                <p className="text-muted-foreground">Try video content - it's trending 45% higher this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={metric.label} className="animate-slide-up transition-all hover:shadow-lg hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <TrendingUp className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                <p className={`text-sm mt-2 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Platform Performance */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Platform Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {platformData.map((platform, index) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{platform.reach}</p>
                      <p className="text-sm text-muted-foreground">{platform.posts} posts</p>
                    </div>
                  </div>
                  <Progress value={platform.engagement} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {platform.engagement}% engagement rate
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performing Content */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Top Performing Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.title} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div>
                    <h4 className="font-medium text-foreground">{post.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{post.engagement}%</p>
                    <p className="text-xs text-muted-foreground">engagement</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Engagement Timeline */}
        <Card className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Engagement Timeline (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2 bg-muted/20 rounded-lg p-4">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="bg-primary rounded-t-sm transition-all duration-300 hover:bg-primary/80 cursor-pointer min-w-[8px]"
                  style={{ height: `${Math.random() * 100}%` }}
                  title={`Day ${i + 1}: ${Math.floor(Math.random() * 1000)} engagements`}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Prompt */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/50 animate-pulse-gentle">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Unlock Advanced Analytics
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get deeper insights with competitor analysis, advanced segmentation, custom reports, and real-time alerts for just $5/month.
            </p>
            <Button size="lg" className="transition-all hover:scale-105 hover:shadow-lg">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}