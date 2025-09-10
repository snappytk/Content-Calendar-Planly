import { useState, useCallback } from "react";
import { Link } from "wouter";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Settings, ChevronLeft, ChevronRight, Filter, BarChart3, Clock, Home, Zap, Crown, LogOut, User } from "lucide-react";
import { ContentModal } from "./ContentModal";
import { AIAssistant } from "./AIAssistant";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";
import { type ContentItem } from "@shared/schema";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ContentItem;
}

export function ContentPlannerApp() {
  const { toast: useToastHook } = useToast();
  const { user, loading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [filters, setFilters] = useState({
    platforms: { social: true, email: true, blog: true },
    statuses: { draft: true, scheduled: true, posted: true }
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleSuggestionUse = (suggestion: any) => {
    setEditingItem({
      id: '',
      title: suggestion.title,
      description: null,
      platform: suggestion.platform,
      scheduledDate: new Date(),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    } as ContentItem);
    setIsModalOpen(true);
  };

  // Show auth modal if not authenticated
  if (!loading && !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-4xl font-bold text-foreground">Welcome to ContentPro</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Please sign in to access your content planning dashboard
          </p>
          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            size="lg"
            className="transition-all duration-300 hover:scale-105"
          >
            Sign In to Continue
          </Button>
        </div>
        <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Fetch content items
  const { data: contentItems = [], isLoading } = useQuery<ContentItem[]>({
    queryKey: ['/api/content'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast.success('Content item deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete content item');
    },
  });

  // Filter content items
  const filteredItems = contentItems.filter(item => 
    filters.platforms[item.platform as keyof typeof filters.platforms] &&
    filters.statuses[item.status as keyof typeof filters.statuses]
  );

  // Convert content items to calendar events
  const events: CalendarEvent[] = filteredItems.map(item => ({
    id: item.id,
    title: item.title,
    start: new Date(item.scheduledDate),
    end: new Date(item.scheduledDate),
    resource: item,
  }));

  // Event style getter
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const { status, platform } = event.resource;
    
    let backgroundColor = '#6b7280'; // gray-500 for draft
    let borderColor = '#6b7280';
    
    if (status === 'scheduled') {
      backgroundColor = '#f59e0b'; // yellow-500
      borderColor = '#f59e0b';
    } else if (status === 'posted') {
      backgroundColor = '#10b981'; // green-500
      borderColor = '#10b981';
    }

    // Platform border indicators
    let borderRight = '3px solid #6366f1'; // indigo-500 for social
    if (platform === 'email') {
      borderRight = '3px solid #ef4444'; // red-500
    } else if (platform === 'blog') {
      borderRight = '3px solid #8b5cf6'; // violet-500
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRight,
        color: 'white',
        fontSize: '12px',
        padding: '2px 4px',
        borderRadius: '4px',
      }
    };
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setEditingItem(event.resource);
    setIsModalOpen(true);
  }, []);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const platformCounts = {
    social: contentItems.filter(item => item.platform === 'social').length,
    email: contentItems.filter(item => item.platform === 'email').length,
    blog: contentItems.filter(item => item.platform === 'blog').length,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background animate-fade-in">
      {/* Sidebar */}
      <div className="hidden lg:flex w-80 bg-card border-r border-border flex-col animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-5 w-5" />
              </Link>
              <span className="text-muted-foreground">/</span>
              <h1 className="text-2xl font-bold text-foreground">Content Planner</h1>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="transition-all duration-200 hover:scale-105">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user?.email}</div>
                    <div className="text-muted-foreground text-xs">Content Creator</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscription" className="flex items-center">
                      <Crown className="h-4 w-4 mr-2" />
                      Subscription
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Button 
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
              toast.success("Ready to create amazing content! ✨");
            }}
            className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            data-testid="button-add-content"
          >
            <Plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
            Add New Content
          </Button>
        </div>

        {/* Premium Features Navigation */}
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold mb-4 text-foreground">Premium Features</h3>
          <div className="space-y-2">
            <Link href="/analytics">
              <Button 
                variant="ghost" 
                className="w-full justify-start transition-all duration-200 hover:scale-105 hover:bg-primary/10"
                data-testid="link-analytics"
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Analytics Dashboard
                <Zap className="h-3 w-3 ml-auto text-yellow-500" />
              </Button>
            </Link>
            <Link href="/bulk-scheduling">
              <Button 
                variant="ghost" 
                className="w-full justify-start transition-all duration-200 hover:scale-105 hover:bg-primary/10"
                data-testid="link-bulk-scheduling"
              >
                <Clock className="h-4 w-4 mr-3" />
                Bulk Scheduling
                <Zap className="h-3 w-3 ml-auto text-yellow-500" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Platform Filter */}
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter by Platform
          </h3>
          <div className="space-y-3">
            {Object.entries({
              social: { label: 'Social Media', count: platformCounts.social },
              email: { label: 'Email', count: platformCounts.email },
              blog: { label: 'Blog', count: platformCounts.blog },
            }).map(([key, { label, count }]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`platform-${key}`}
                    checked={filters.platforms[key as keyof typeof filters.platforms]}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({
                        ...prev,
                        platforms: { ...prev.platforms, [key]: checked }
                      }))
                    }
                    data-testid={`checkbox-platform-${key}`}
                  />
                  <label htmlFor={`platform-${key}`} className="text-sm cursor-pointer">
                    {label}
                  </label>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold mb-4 text-foreground">Filter by Status</h3>
          <div className="space-y-3">
            {Object.entries({
              draft: { label: 'Draft', color: 'bg-gray-400' },
              scheduled: { label: 'Scheduled', color: 'bg-yellow-400' },
              posted: { label: 'Posted', color: 'bg-green-400' },
            }).map(([key, { label, color }]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`status-${key}`}
                    checked={filters.statuses[key as keyof typeof filters.statuses]}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({
                        ...prev,
                        statuses: { ...prev.statuses, [key]: checked }
                      }))
                    }
                    data-testid={`checkbox-status-${key}`}
                  />
                  <label htmlFor={`status-${key}`} className="text-sm cursor-pointer">
                    {label}
                  </label>
                </div>
                <div className={`w-3 h-3 rounded-full ${color}`} />
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div className="p-6 border-b border-border">
          <AIAssistant onSuggestionUse={handleSuggestionUse} />
        </div>

        {/* Subscription Integration */}
        <div className="p-6 mt-auto">
          <Card className="bg-secondary border-border transition-all duration-300 hover:shadow-xl hover:scale-105 animate-pulse-gentle">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 text-foreground">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get unlimited content scheduling and advanced analytics
              </p>
              
              <Link href="/subscription">
                <Button className="w-full transition-all duration-300 hover:scale-105" data-testid="upgrade-button">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </Link>
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                $5.00/month • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
        {/* Calendar Header */}
        <div className="bg-card border-b border-border p-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-foreground">
                {moment(currentDate).format('MMMM YYYY')}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())}
                  data-testid="button-prev-month"
                  className="transition-all duration-200 hover:scale-110 hover:bg-primary/20"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform duration-200 hover:-translate-x-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate(moment(currentDate).add(1, 'month').toDate())}
                  data-testid="button-next-month"
                  className="transition-all duration-200 hover:scale-110 hover:bg-primary/20"
                >
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 hover:translate-x-1" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
                data-testid="button-today"
                className="transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Today
              </Button>
              <div className="flex bg-muted rounded-lg p-1">
                {(['month', 'week', 'day'] as const).map((viewOption) => (
                  <Button
                    key={viewOption}
                    variant={view === viewOption ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView(viewOption)}
                    data-testid={`button-view-${viewOption}`}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="h-full bg-card rounded-lg border border-border p-4 animate-fade-in transition-all duration-500 hover:shadow-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
                  <p className="text-muted-foreground">Loading your content calendar...</p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                view={view}
                onView={(view) => {
                  if (view === 'month' || view === 'week' || view === 'day') {
                    setView(view);
                  }
                }}
                date={currentDate}
                onNavigate={setCurrentDate}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                eventPropGetter={eventStyleGetter}
                popup
                className="content-calendar"
                messages={{
                  today: 'Today',
                  previous: 'Previous',
                  next: 'Next',
                  month: 'Month',
                  week: 'Week',
                  day: 'Day',
                  agenda: 'Agenda',
                  date: 'Date',
                  time: 'Time',
                  event: 'Content',
                  noEventsInRange: 'No content scheduled for this period. Click on a date to add content!',
                  showMore: (total) => `+${total} more`
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />
    </div>
  );
}
