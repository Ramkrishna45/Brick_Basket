"use client";

import { useState } from "react";
import { toast } from "sonner";
import { sendNotificationAction } from "@/lib/actions/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Send } from "lucide-react";

export default function AdminNotificationsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [target, setTarget] = useState("all");
  const [type, setType] = useState("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.length < 3) return toast.error("Title must be at least 3 characters");
    if (message.length < 10) return toast.error("Message must be at least 10 characters");

    setIsSubmitting(true);
    try {
      const res = await sendNotificationAction({
        title,
        message,
        type,
        userId: target,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Notification sent successfully!");
        setTitle("");
        setMessage("");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Send Notifications</h1>
          <p className="text-slate-500">Broadcast offers, updates, or alerts to your customers.</p>
        </div>
        <BellRing className="h-8 w-8 text-slate-300" />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Notification</CardTitle>
          <CardDescription>
            This will appear in the customer's notification bell in their dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Send To</Label>
              <Select value={target} onValueChange={(val) => setTarget(val || "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[0.8rem] text-slate-500">Select who should receive this notification.</p>
            </div>

            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select value={type} onValueChange={(val) => setType(val || "info")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information (Blue)</SelectItem>
                  <SelectItem value="success">Success (Green)</SelectItem>
                  <SelectItem value="warning">Warning / Offer (Yellow)</SelectItem>
                  <SelectItem value="error">Alert (Red)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Special Festival Offer!" 
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the full details of the notification here..." 
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
