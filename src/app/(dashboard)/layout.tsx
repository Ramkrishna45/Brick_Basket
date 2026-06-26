"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { HardHat, Bell, LogOut, ChevronDown, User } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarInset, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/lib/auth-client";
import { CUSTOMER_NAV, BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/project": "My Project",
  "/progress": "Daily Progress",
  "/documents": "Documents",
  "/payments": "Payments",
  "/photos": "Photos & Videos",
  "/messages": "Messages",
  "/settings": "Settings",
  "/new-enquiry": "New Enquiry",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const pageTitle = breadcrumbMap[pathname] || "Dashboard";
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  function handleLogout() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-slate-200">
        <SidebarHeader className="p-4 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 flex-shrink-0">
              <HardHat className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-tight">{BRAND.name}</div>
              <div className="text-xs text-slate-500">Customer Portal</div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {CUSTOMER_NAV.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      render={<Link href={item.href} />}
                      className={cn("rounded-lg h-10 gap-3",
                        pathname === item.href
                          ? "bg-amber-50 text-amber-700 font-medium hover:bg-amber-100"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )}>
                      {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3 border-t border-slate-200">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-100 transition-colors text-left">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-amber-100 text-amber-700 text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <User className="h-4 w-4 mr-2" />Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 sticky top-0 z-20">
          <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/dashboard" className="text-slate-500 hover:text-amber-600 text-xs">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="text-slate-900 text-xs font-medium">{pageTitle}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Bell className="h-4 w-4 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { title: "New Progress Update", msg: "Wall work — east side completed", time: "Just now" },
                  { title: "Payment Due Soon", msg: "₹7,56,000 due on Jan 15", time: "2h ago" },
                  { title: "Document Uploaded", msg: "Material Quality Certificate", time: "Yesterday" },
                ].map((n, i) => (
                  <DropdownMenuItem key={i} className="flex-col items-start py-2.5 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                      <span className="text-xs text-slate-400">{n.time}</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5">{n.msg}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-amber-100 text-amber-700 text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
