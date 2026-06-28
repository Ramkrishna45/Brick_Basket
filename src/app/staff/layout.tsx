"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Building2, 
  ClipboardList,
  MessageSquare,
  LogOut,
  Bell,
  Menu,
  HardHat
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const STAFF_NAV = [
  { title: "Dashboard", href: "/staff/dashboard", icon: Building2 },
  { title: "Upload Progress", href: "/staff/progress", icon: ClipboardList },
  { title: "Customer Messages", href: "/staff/messages", icon: MessageSquare },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "ST";

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 w-full overflow-hidden">
        <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <SidebarHeader className="p-4">
            <Link href="/staff/dashboard" className="flex items-center gap-2 px-2">
              <div className="bg-amber-600 p-1.5 rounded-md">
                <HardHat className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight">Staff Portal</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarMenu className="gap-2">
              {STAFF_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.href} className="w-full">
                      <SidebarMenuButton 
                        isActive={isActive}
                        className={`w-full justify-start h-11 px-3 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-950/40 hover:text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-900 hover:text-slate-900 dark:text-slate-100'}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-amber-600 dark:text-amber-500' : 'text-slate-400'}`} />
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
                  <AvatarFallback className="bg-amber-100 text-amber-700 dark:text-amber-400 font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">{user?.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-transparent">
          <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-border bg-background shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h2 className="text-sm font-medium text-muted-foreground capitalize hidden sm:block">
                {pathname.split("/").pop()?.replace("-", " ")}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild><div className="relative p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-900 transition-colors focus:outline-none pointer-events-auto cursor-pointer">
                  <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No new notifications</div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
