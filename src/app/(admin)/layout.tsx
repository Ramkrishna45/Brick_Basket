"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { HardHat, Bell, LogOut, ChevronDown, Search } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarInset, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/lib/auth-client";
import { ADMIN_NAV, BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/leads": "Leads",
  "/projects": "Projects",
  "/uploads": "Upload Progress",
  "/admin-payments": "Payments",
  "/admin-documents": "Documents",
  "/staff": "Staff",
  "/reports": "Reports",
  "/admin-settings": "Settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "admin" && user?.role !== "engineer") {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || (user?.role !== "admin" && user?.role !== "engineer")) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const pageTitle = breadcrumbMap[pathname] || "Admin Portal";
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "A";

  function handleLogout() { signOut({ callbackUrl: "/login" }); }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-slate-200">
        <SidebarHeader className="p-4 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 flex-shrink-0">
              <HardHat className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm leading-tight">{BRAND.name}</span>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs py-0 px-1.5">Admin</Badge>
              </div>
              <div className="text-xs text-slate-500">Operations Portal</div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_NAV.map((item) => (
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
                <div className="text-xs text-amber-600 font-medium truncate capitalize">{user?.role}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-52">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 sticky top-0 z-20">
          <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
          <Separator orientation="vertical" className="h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/admin" className="text-slate-500 hover:text-amber-600 text-xs">Admin</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage className="text-slate-900 text-xs font-medium">{pageTitle}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input className="pl-8 w-48 h-8 text-sm bg-slate-50 border-slate-200" placeholder="Search..." />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
            </button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-amber-100 text-amber-700 text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-slate-50 min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
