import { useState } from "react";
import { Link } from "wouter";
import { Calendar, BarChart3, Clock, Zap, Check, ArrowRight, Users, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";
import heroImage from "@assets/generated_images/Content_planner_hero_image_17a70e0b.png";
import analyticsImage from "@assets/generated_images/Dashboard_analytics_illustration_62ccec57.png";
import bulkSchedulingImage from "@assets/generated_images/Bulk_scheduling_feature_illustration_12787e77.png";

export default function Landing() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar Planning",
      description: "Organize all your content across multiple platforms in one beautiful calendar view.",
      included: true
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track performance, engagement, and growth with detailed insights and reports.",
      included: false,
      premium: true
    },
    {
      icon: Clock,
      title: "Bulk Scheduling",
      description: "Schedule dozens of posts at once and automate your content pipeline.",
      included: false,
      premium: true
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team, assign tasks, and manage approval workflows.",
      included: false,
      premium: true
    },
    {
      icon: TrendingUp,
      title: "AI Content Suggestions",
      description: "Get smart recommendations for optimal posting times and content ideas.",
      included: false,
      premium: true
    },
    {
      icon: Globe,
      title: "Multi-Platform Publishing",
      description: "Automatically publish to all your social media accounts and blog platforms.",
      included: false,
      premium: true
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager",
      content: "This tool has revolutionized our content strategy. We've seen a 300% increase in engagement!"
    },
    {
      name: "Mike Rodriguez",
      role: "Social Media Creator",
      content: "The bulk scheduling feature alone has saved me 10+ hours per week. Absolutely worth it!"
    },
    {
      name: "Emma Thompson",
      role: "Content Director",
      content: "The analytics dashboard gives us insights we never had before. Game-changer for our team!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-foreground">ContentPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/app" className="text-muted-foreground hover:text-foreground transition-colors">
                App
              </Link>
              <ThemeToggle />
              <Link href="/app">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/app">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-4 animate-pulse-gentle" variant="secondary">
                ✨ Now with AI-powered insights
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
                Plan Your Content.
                <span className="text-primary block">Grow Your Audience.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                The all-in-one content planning platform that helps creators and businesses schedule, analyze, and optimize their content across all platforms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link href="/app">
                  <Button 
                    size="lg" 
                    className="group transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    data-testid="button-start-free"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    toast.success("Demo video coming soon! For now, explore the free trial.");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-6"></div>
              <img 
                src={heroImage} 
                alt="Content Planning Dashboard"
                className="relative z-10 rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From basic planning to advanced analytics, we've got all the tools to take your content strategy to the next level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`transition-all duration-300 hover:shadow-xl hover:scale-105 animate-slide-up ${
                  feature.premium ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-transparent' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setIsHovered(feature.title)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className={`h-8 w-8 transition-all duration-300 ${
                      isHovered === feature.title ? 'text-primary scale-110' : 'text-foreground'
                    }`} />
                    {feature.premium && (
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you're ready to scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Plan */}
            <Card className="animate-slide-up transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold text-foreground mt-4">
                  $0<span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Up to 10 content items</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basic calendar view</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>3 platforms</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link href="/app">
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 transition-all duration-300 hover:scale-105"
                    data-testid="button-start-free-plan"
                  >
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="animate-slide-up border-primary relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-purple-500 h-1"></div>
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-4xl font-bold text-foreground mt-4">
                  $5<span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Everything you need to scale</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Unlimited content items</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Bulk scheduling</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>AI suggestions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/subscription">
                  <Button 
                    className="w-full mt-6 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                    data-testid="button-upgrade-premium"
                  >
                    Upgrade to Premium
                    <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Features Showcase */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Premium Features That Drive Results
            </h2>
          </div>

          <div className="space-y-20">
            {/* Analytics Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <Badge className="mb-4" variant="outline">Analytics</Badge>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Deep Insights Into Your Content Performance
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Track engagement, reach, and conversion across all platforms. Identify your best-performing content and optimize your strategy with data-driven insights.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Real-time performance metrics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Competitor analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom reporting dashboards</span>
                  </li>
                </ul>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <img 
                  src={analyticsImage} 
                  alt="Analytics Dashboard"
                  className="rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Bulk Scheduling Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in order-2 lg:order-1" style={{ animationDelay: '0.3s' }}>
                <img 
                  src={bulkSchedulingImage} 
                  alt="Bulk Scheduling"
                  className="rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="animate-slide-up order-1 lg:order-2">
                <Badge className="mb-4" variant="outline">Automation</Badge>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Schedule Weeks of Content in Minutes
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Upload multiple posts at once, set optimal posting times, and let our AI distribute your content across platforms for maximum engagement.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>CSV import for bulk uploads</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Smart time optimization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Auto-posting to all platforms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Loved by Content Creators Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className="animate-slide-up transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Content Strategy?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of creators who are already growing their audience with ContentPro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="group transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  data-testid="button-get-started-cta"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/80 mt-4">
              14-day free trial • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-foreground">ContentPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ContentPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}