"use client";

import { useState } from "react";
import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";
import { User, Bell, Shield, Key, ChevronDown, ChevronUp, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Manage your profile, preferences and security.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-amber-100 text-amber-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <User className="h-4 w-4" />
            Profile Information
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "notifications" ? "bg-amber-100 text-amber-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "security" ? "bg-amber-100 text-amber-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <Shield className="h-4 w-4" />
            Security
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input placeholder="your.email@example.com" disabled />
                    <p className="text-xs text-slate-500">Contact support to change email.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="Your Phone Number" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about project updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Email Alerts</Label>
                    <p className="text-sm text-slate-500">Receive emails when milestones are completed.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-amber-600 transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">WhatsApp Updates</Label>
                    <p className="text-sm text-slate-500">Get photos and quick updates on WhatsApp.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-amber-600 transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-slate-500">Get text messages for payments and critical alerts.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors cursor-pointer">
                    <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your security preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-md shadow-sm">
                          <Key className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-slate-900">Change Password</h4>
                          <p className="text-xs text-slate-500">Update your current password</p>
                        </div>
                      </div>
                      {showPasswordChange ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    
                    {showPasswordChange && (
                      <div className="p-4 border-t border-slate-200 bg-white">
                        <ChangePasswordForm />
                      </div>
                    )}
                  </div>
                  
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
