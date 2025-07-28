import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Route, Switch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Setup from "@/pages/Setup";
import Bookings from "@/pages/Bookings";
import Guests from "@/pages/Guests";
import Rooms from "@/pages/Rooms";
import Settings from "@/pages/Settings";
import { Navigation } from "@/components/Navigation";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/setup" component={Setup} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/guests" component={Guests} />
          <Route path="/rooms" component={Rooms} />
          <Route path="/settings" component={Settings} />
          <Route>
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold">Page Not Found</h1>
              <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}