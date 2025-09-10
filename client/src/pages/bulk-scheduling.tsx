import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Upload, Calendar, CheckCircle, Clock, AlertCircle, Download, FileText, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/use-subscription";

export default function BulkScheduling() {
  const { toast } = useToast();
  const { hasAccess } = useSubscription();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bulkContent, setBulkContent] = useState("");

  const handleBulkUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Success!",
            description: "24 posts scheduled successfully across all platforms",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const scheduledPosts = [
    { id: 1, title: "Monday Morning Motivation", platform: "Social", date: "2024-09-16", status: "scheduled" },
    { id: 2, title: "Product Feature Highlight", platform: "Email", date: "2024-09-17", status: "scheduled" },
    { id: 3, title: "Industry Trends Analysis", platform: "Blog", date: "2024-09-18", status: "draft" },
    { id: 4, title: "Customer Success Story", platform: "Social", date: "2024-09-19", status: "scheduled" },
    { id: 5, title: "Weekly Newsletter", platform: "Email", date: "2024-09-20", status: "scheduled" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Premium gate for non-subscribers
  if (!hasAccess('bulk-scheduling')) {
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
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">Bulk Scheduling</h1>
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
                    Premium Bulk Scheduling
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Save hours by scheduling dozens of posts at once with CSV import, smart timing, and automated distribution.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">CSV Import</h3>
                      <p className="text-sm text-muted-foreground">Upload multiple posts at once</p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Smart Timing</h3>
                      <p className="text-sm text-muted-foreground">AI-optimized posting schedules</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold">Auto Distribution</h3>
                      <p className="text-sm text-muted-foreground">Spread content across platforms</p>
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="transition-all hover:scale-105">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Planner
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Bulk Scheduling</h1>
              <Badge variant="secondary">Premium Feature</Badge>
            </div>
            <Button variant="outline" size="sm" className="transition-all hover:scale-105">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Bulk Input */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Quick Bulk Input
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paste multiple content ideas, one per line. We'll help you schedule them optimally.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Motivational Monday quote&#10;Product feature highlight&#10;Customer testimonial&#10;Industry news update&#10;Behind the scenes content"
                  value={bulkContent}
                  onChange={(e) => setBulkContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex items-center space-x-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Default platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Posting frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="business-days">Business Days</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleBulkUpload}
                  disabled={isUploading || !bulkContent.trim()}
                  className="transition-all hover:scale-105 hover:shadow-lg"
                >
                  {isUploading ? "Processing..." : "Schedule Content"}
                  <Calendar className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* CSV Upload */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  CSV Upload
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with your content schedule. Supports title, description, platform, and date columns.
                </p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Drop your CSV file here
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>

                {isUploading && (
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing content...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Stats */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bulk Uploads</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Content Scheduled</span>
                  <span className="font-bold">384</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time Saved</span>
                  <span className="font-bold text-green-600">14.2 hrs</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Schedule posts for peak engagement times automatically</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Use templates to maintain consistent formatting</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Preview all posts before scheduling</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Mix content types for better engagement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Bulk Uploads */}
        <Card className="mt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardHeader>
            <CardTitle>Recently Scheduled Content</CardTitle>
            <p className="text-sm text-muted-foreground">
              Content from your latest bulk upload
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(post.status)}
                    <div>
                      <h4 className="font-medium text-foreground">{post.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(post.status)}`}>
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Prompt */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/50 animate-pulse-gentle">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Save Hours Every Week
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Upgrade to Premium for unlimited bulk uploads, smart scheduling, and advanced automation features for just $5/month.
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