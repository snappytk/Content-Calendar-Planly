import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X, Save, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContentItemSchema, type ContentItem, type InsertContentItem } from "@shared/schema";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: ContentItem | null;
}

export function ContentModal({ isOpen, onClose, editingItem }: ContentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertContentItem>({
    resolver: zodResolver(insertContentItemSchema),
    defaultValues: {
      title: "",
      description: "",
      platform: "social",
      scheduledDate: new Date(),
      status: "draft",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertContentItem) => 
      apiRequest('POST', '/api/content', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: "Success",
        description: "Content item created successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create content item",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertContentItem> }) =>
      apiRequest('PUT', `/api/content/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: "Success",
        description: "Content item updated successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content item",
        variant: "destructive",
      });
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (editingItem) {
      form.reset({
        title: editingItem.title,
        description: editingItem.description || "",
        platform: editingItem.platform as "social" | "email" | "blog",
        scheduledDate: new Date(editingItem.scheduledDate),
        status: editingItem.status as "draft" | "scheduled" | "posted",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        platform: "social",
        scheduledDate: new Date(),
        status: "draft",
      });
    }
  }, [editingItem, form]);

  const onSubmit = async (data: InsertContentItem) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  // Format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingItem ? "Edit Content" : "Add New Content"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Content Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter content title..."
                      {...field}
                      data-testid="input-title"
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your content..."
                      rows={4}
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Platform Selection */}
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Platform <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-platform" className="transition-all duration-200 hover:border-primary/50">
                        <SelectValue placeholder="Select platform..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scheduled Date */}
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Scheduled Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={formatDateForInput(field.value)}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-scheduled-date"
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Selection */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Status <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-3 gap-3"
                    >
                      {[
                        { value: "draft", label: "Draft", desc: "Not ready", color: "bg-gray-400" },
                        { value: "scheduled", label: "Scheduled", desc: "Ready to post", color: "bg-yellow-400" },
                        { value: "posted", label: "Posted", desc: "Published", color: "bg-green-400" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className="peer sr-only"
                            data-testid={`radio-status-${option.value}`}
                          />
                          <Label
                            htmlFor={option.value}
                            className="cursor-pointer p-4 border-2 border-border rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 transition-all duration-300 hover:bg-accent hover:scale-105 hover:shadow-md w-full"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${option.color}`} />
                              <div>
                                <div className="font-medium text-foreground">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.desc}</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                data-testid="button-cancel"
                className="transition-all duration-200 hover:scale-105"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="button-save"
                className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingItem ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingItem ? "Update Content" : "Save Content"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
