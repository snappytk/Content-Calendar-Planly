import { useState, useEffect } from 'react';

interface SubscriptionInfo {
  id: string;
  status: string;
  startDate: string;
  planId: string;
  endDate?: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = () => {
      try {
        const savedSubscription = localStorage.getItem('premium_subscription');
        if (savedSubscription) {
          const parsed = JSON.parse(savedSubscription);
          // Check if subscription has expired
          if (parsed.endDate && new Date(parsed.endDate) < new Date()) {
            // Subscription expired, remove it
            localStorage.removeItem('premium_subscription');
            setSubscription(null);
          } else {
            setSubscription(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
        setSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'premium_subscription') {
        loadSubscription();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isPremium = () => {
    if (!subscription) return false;
    
    // Check if subscription is active and not expired
    if (subscription.status === 'cancelled' && subscription.endDate) {
      return new Date(subscription.endDate) > new Date();
    }
    
    return subscription.status === 'active';
  };

  const hasAccess = (feature: string) => {
    // Free features that everyone has access to
    const freeFeatures = ['basic-calendar', 'content-creation', 'basic-filtering'];
    
    if (freeFeatures.includes(feature)) {
      return true;
    }
    
    // Premium features
    const premiumFeatures = ['analytics', 'bulk-scheduling', 'team-collaboration', 'ai-suggestions', 'advanced-export'];
    
    if (premiumFeatures.includes(feature)) {
      return isPremium();
    }
    
    return false;
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return 'none';
    
    if (subscription.status === 'cancelled') {
      if (subscription.endDate && new Date(subscription.endDate) > new Date()) {
        return 'cancelled-active'; // Cancelled but still active until end date
      }
      return 'expired';
    }
    
    return subscription.status;
  };

  const getDaysUntilExpiration = () => {
    if (!subscription?.endDate) return null;
    
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  return {
    subscription,
    isLoading,
    isPremium: isPremium(),
    hasAccess,
    getSubscriptionStatus,
    getDaysUntilExpiration,
    setSubscription
  };
}