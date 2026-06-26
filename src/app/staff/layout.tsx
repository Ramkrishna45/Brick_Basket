"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  CustomDropdown, 
  CustomDropdownLabel, 
  CustomDropdownSeparator 
} from "@/components/shared/custom-dropdown";
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
      <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-4">
            <Link href="/staff/dashboard" className="flex items-center gap-2 px-2">
              <div className="bg-amber-600 p-1.5 rounded-md">
                <HardHat className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Staff Portal</span>
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
                        className={`w-full justify-start h-11 px-3 ${isActive ? 'bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-slate-200">
                  <AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</span>
                  <span className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-transparent">
          <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-slate-200 bg-white shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h2 className="text-sm font-medium text-slate-500 capitalize hidden sm:block">
                {pathname.split("/").pop()?.replace("-", " ")}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <CustomDropdown
                className="w-72"
                align="end"
                trigger={
                  <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none pointer-events-auto">
                    <Bell className="h-5 w-5 text-slate-600 pointer-events-none" />
                  </button>
                }
              >
                <CustomDropdownLabel>Notifications</CustomDropdownLabel>
                <CustomDropdownSeparator />
                <div className="p-4 text-center text-sm text-slate-500">No new notifications</div>
              </CustomDropdown>
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
