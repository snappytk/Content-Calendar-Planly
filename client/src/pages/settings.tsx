import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, User, Bell, Palette, Shield, Trash2, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SubscriptionInfo {
  id: string;
  status: string;
  startDate: string;
  planId: string;
}

export default function Settings() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });
  const [profile, setProfile] = useState({
    name: "User",
    email: "user@example.com",
    bio: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load subscription info from localStorage
    const savedSubscription = localStorage.getItem('premium_subscription');
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
    }

    // Load user preferences from localStorage
    const savedNotifications = localStorage.getItem('user_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleCancelSubscription = () => {
    if (subscription) {
      const confirmed = window.confirm(
        "Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period."
      );
      
      if (confirmed) {
        // Update subscription status to cancelled
        const updatedSubscription = {
          ...subscription,
          status: 'cancelled',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // End in 30 days
        };
        
        setSubscription(updatedSubscription);
        localStorage.setItem('premium_subscription', JSON.stringify(updatedSubscription));
        
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been cancelled and will end at the end of this month.",
        });
      }
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
    );
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        "This is your final warning. Deleting your account will permanently remove all your content, settings, and subscription. Type 'DELETE' to confirm."
      );
      
      if (doubleConfirmed) {
        // Clear all user data
        localStorage.clear();
        
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted. Redirecting to home page...",
          variant: "destructive",
        });
        
        // Redirect to home page after a delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              <User className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Settings</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
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
            <CardContent>
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Premium Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Status: <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                          {subscription.status}
                        </Badge>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">$5.00/month</div>
                      <p className="text-sm text-muted-foreground">
                        Started: {formatDate(subscription.startDate)}
                      </p>
                    </div>
                  </div>
                  
                  {subscription.status === 'active' && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Your subscription will renew automatically at the end of each month.
                        You can cancel anytime and continue using premium features until the end of your billing period.
                      </p>
                      <Button 
                        variant="destructive" 
                        onClick={handleCancelSubscription}
                        className="mt-4"
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                  
                  {subscription.status === 'cancelled' && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Your subscription has been cancelled and will end on {formatDate((subscription as any).endDate)}.
                        You can still use premium features until then.
                      </p>
                      <Link href="/subscription">
                        <Button className="mt-2" size="sm">
                          Reactivate Subscription
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Active Subscription</h3>
                  <p className="text-muted-foreground mb-4">
                    Upgrade to Premium to unlock all features
                  </p>
                  <Link href="/subscription">
                    <Button>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your content</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when content is published</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-notifications">Marketing Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive news and feature updates</p>
                </div>
                <Switch
                  id="marketing-notifications"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, marketing: checked })
                  }
                />
              </div>
              
              <Button onClick={handleSaveNotifications} className="mt-4">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-destructive mb-2">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}