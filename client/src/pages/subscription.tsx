import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Check, ArrowLeft, Crown, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function Subscription() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load PayPal script
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AcfpjwLgDGThXpyOnYWUoWdFG7SM_h485vJULqGENmPyeiwfD20Prjfx6xRrqYOSZlM4s-Rnh3OfjXhk&vault=true&intent=subscription";
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    
    script.onload = () => {
      setIsLoading(false);
      initializePayPalButton();
    };
    
    script.onerror = () => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load PayPal. Please try again.",
        variant: "destructive",
      });
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src*="paypal.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const initializePayPalButton = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: 'P-8V897502VC4648024NDAUXGA'
          });
        },
        onApprove: function(data: any, actions: any) {
          setSubscriptionActive(true);
          // Store subscription info in localStorage for demo purposes
          localStorage.setItem('premium_subscription', JSON.stringify({
            id: data.subscriptionID,
            status: 'active',
            startDate: new Date().toISOString(),
            planId: 'P-8V897502VC4648024NDAUXGA'
          }));
          
          toast({
            title: "Success!",
            description: `Subscription activated! ID: ${data.subscriptionID}`,
          });
        },
        onError: function(err: any) {
          toast({
            title: "Error",
            description: "There was an error processing your subscription. Please try again.",
            variant: "destructive",
          });
        },
        onCancel: function(data: any) {
          toast({
            title: "Cancelled",
            description: "Subscription was cancelled.",
          });
        }
      }).render('#paypal-button-container-P-8V897502VC4648024NDAUXGA');
    }
  };

  const features = [
    {
      icon: Check,
      title: "Unlimited Content Items",
      description: "Create and schedule as much content as you need"
    },
    {
      icon: Check,
      title: "Advanced Analytics",
      description: "Deep insights into your content performance"
    },
    {
      icon: Check,
      title: "Bulk Scheduling",
      description: "Upload and schedule multiple posts at once"
    },
    {
      icon: Check,
      title: "Team Collaboration",
      description: "Work together with your team members"
    },
    {
      icon: Check,
      title: "AI Content Suggestions",
      description: "Get smart recommendations for your content"
    },
    {
      icon: Check,
      title: "Priority Support",
      description: "Get help when you need it most"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to App
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Premium Subscription</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            <Zap className="h-3 w-3 mr-1" />
            Premium Plan
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Unlock All Premium Features
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Get unlimited access to advanced content planning tools
          </p>
          <div className="text-3xl font-bold text-primary">
            $5.00<span className="text-lg text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <Shield className="h-4 w-4 inline mr-1" />
            Cancel anytime • Free trial ends at month end
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features List */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">What's Included:</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <feature.icon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <Card className="border-primary/50 bg-gradient-to-b from-primary/5 to-transparent">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Start Your Premium Subscription</CardTitle>
                <p className="text-muted-foreground">
                  Secure payment powered by PayPal
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  <div id="paypal-button-container-P-8V897502VC4648024NDAUXGA" className="min-h-[50px]"></div>
                )}
                
                {subscriptionActive && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Subscription Activated!
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                      You now have access to all premium features.
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Subscription renews monthly at $5.00</p>
                  <p>• Cancel anytime from your settings</p>
                  <p>• Free trial automatically ends at month end</p>
                  <p>• No refunds for partial months</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}