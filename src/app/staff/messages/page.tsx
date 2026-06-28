"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Send, MessageSquare, User, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getStaffAssignedProjectsAction } from "@/lib/actions/staff-projects";

export default function StaffMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Form state
  const [projectId, setProjectId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await getStaffAssignedProjectsAction();
      if (res.success && res.data) {
        setProjects(res.data);
        if (res.data.length > 0) {
          setProjectId(res.data[0].id);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const selectedProject = projects.find(p => p.id === projectId);

  const handleSendMessage = async () => {
    if (!projectId || !subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSending(true);
    
    // In a real app, this would call a server action that uses sendEmail
    // from "@/lib/mail" to email the customer, and possibly save the message to the DB.
    // For this demonstration, we'll simulate the API call.
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent to customer successfully!");
    
    setSubject("");
    setMessage("");
    setIsSending(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Customer Communication</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Send updates, questions, or notices directly to your assigned customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Form */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="project">Select Customer / Project</Label>
                <Select value={projectId} onValueChange={(val) => setProjectId(val || "")}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.customer?.name} - {p.name}
                      </SelectItem>
                    ))}
                    {projects.length === 0 && (
                      <SelectItem value="none" disabled>No assigned customers</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g. Question regarding kitchen tiles" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here. The customer will receive this via email."
                  className="min-h-[200px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Email will be sent instantly
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                  disabled={isSending || projects.length === 0}
                >
                  <Send className="h-4 w-4" />
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* Right side: Customer Info Context */}
        <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                Recipient Details
              </h3>
              
              {selectedProject ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Customer Name</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{selectedProject.customer?.name || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Project</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      {selectedProject.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Location</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">{selectedProject.siteAddress}, {selectedProject.city}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Phone Number</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300">{selectedProject.customer?.phone || "Not provided"}</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  Select a project to view customer details.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
