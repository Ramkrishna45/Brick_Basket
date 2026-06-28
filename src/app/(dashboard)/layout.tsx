"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HardHat, Bell, LogOut, ChevronDown, ChevronUp, User } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarInset, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/lib/auth-client";
import { CUSTOMER_NAV, BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getNotificationsAction, markNotificationReadAction } from "@/lib/actions/notifications";

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
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      getNotificationsAction().then((res: any) => {
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      });
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

  async function handleNotificationClick(id: string) {
    await markNotificationReadAction(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-slate-200 dark:border-slate-800">
        <SidebarHeader className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 flex-shrink-0">
              <HardHat className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{BRAND.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Customer Portal</div>
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
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium hover:bg-amber-100"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:bg-slate-900"
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

        <SidebarFooter className="p-3 border-t border-slate-200 dark:border-slate-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><div className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-100 dark:bg-slate-900 transition-colors text-left border border-transparent hover:border-slate-200 dark:border-slate-800 cursor-pointer">
              <Avatar className="h-8 w-8 flex-shrink-0 pointer-events-none">
                <AvatarFallback className="bg-amber-100 text-amber-700 dark:text-amber-400 text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pointer-events-none">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
              </div>
              <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0 pointer-events-none ml-auto" />
            </div></DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 sticky top-0 z-20">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-primary text-xs">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="text-foreground text-xs font-medium">{pageTitle}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><div className="relative p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-900 transition-colors focus:outline-none pointer-events-auto cursor-pointer">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
                )}
              </div></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <DropdownMenuLabel>Notifications ({unreadCount})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn("flex flex-col items-start py-2.5 px-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-900", !n.read && "bg-slate-50 dark:bg-slate-900")}
                      onClick={() => handleNotificationClick(n.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={cn("text-xs font-semibold text-slate-900 dark:text-slate-100", !n.read && "text-amber-700 dark:text-amber-400")}>{n.title}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</span>
                    </div>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild><div className="focus:outline-none rounded-full ring-2 ring-transparent hover:ring-amber-500 transition-all cursor-pointer">
                <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-800">
                  <AvatarFallback className="bg-amber-100 text-amber-700 dark:text-amber-400 font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
              </div></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
