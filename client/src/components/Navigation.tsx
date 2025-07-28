import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Building, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn, bilingualText } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: bilingualText("Dashboard", "డాష్‌బోర్డ్"),
    icon: LayoutDashboard,
  },
  {
    href: "/bookings",
    label: bilingualText("Bookings", "బుకింగ్‌లు"),
    icon: Calendar,
  },
  {
    href: "/guests",
    label: bilingualText("Guests", "అతిథులు"),
    icon: Users,
  },
  {
    href: "/rooms",
    label: bilingualText("Rooms", "గదులు"),
    icon: Building,
  },
  {
    href: "/settings",
    label: bilingualText("Settings", "సెట్టింగ్‌లు"),
    icon: Settings,
  },
];

export function Navigation() {
  const [location] = useLocation();

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
  });

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary">
                {bilingualText("Lodge Management", "లాడ్జ్ మేనేజ్‌మెంట్")}
              </h1>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{bilingualText("Logout", "లాగ్ అవుట్")}</span>
          </Button>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}