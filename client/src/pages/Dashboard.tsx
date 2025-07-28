import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Calendar, IndianRupee } from "lucide-react";
import { bilingualText, formatCurrency } from "@/lib/utils";

interface DashboardData {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  activeBookings: number;
  dailyRevenue: number;
  todayPayments: number;
}

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/analytics/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {bilingualText("Dashboard", "డాష్‌బోర్డ్")}
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: bilingualText("Total Rooms", "మొత్తం గదులు"),
      value: analytics?.totalRooms || 0,
      icon: Building,
      description: bilingualText("Total rooms in lodge", "లాడ్జ్‌లో మొత్తం గదులు"),
    },
    {
      title: bilingualText("Available Rooms", "అందుబాటులో ఉన్న గదులు"),
      value: analytics?.availableRooms || 0,
      icon: Building,
      description: bilingualText("Rooms ready for booking", "బుకింగ్ కోసం సిద్ధంగా ఉన్న గదులు"),
      className: "text-green-600",
    },
    {
      title: bilingualText("Active Bookings", "క్రియాశీల బుకింగ్‌లు"),
      value: analytics?.activeBookings || 0,
      icon: Calendar,
      description: bilingualText("Current active bookings", "ప్రస్తుత క్రియాశీల బుకింగ్‌లు"),
    },
    {
      title: bilingualText("Daily Revenue", "రోజువారీ ఆదాయం"),
      value: formatCurrency(analytics?.dailyRevenue || 0),
      icon: IndianRupee,
      description: bilingualText("Today's total revenue", "నేటి మొత్తం ఆదాయం"),
      className: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {bilingualText("Dashboard", "డాష్‌బోర్డ్")}
        </h1>
        <div className="text-sm text-muted-foreground">
          {bilingualText("Last updated", "చివరిసారిగా అప్‌డేట్ చేయబడింది")}: {new Date().toLocaleString('en-IN')}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-muted-foreground ${stat.className || ""}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.className || ""}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {bilingualText("Room Occupancy", "గదుల ఆక్రమణ")}
            </CardTitle>
            <CardDescription>
              {bilingualText("Current room status overview", "ప్రస్తుత గదుల స్థితి అవలోకనం")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {bilingualText("Occupied", "ఆక్రమించబడిన")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {analytics?.occupiedRooms || 0} / {analytics?.totalRooms || 0}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: analytics?.totalRooms
                      ? `${((analytics.occupiedRooms || 0) / analytics.totalRooms) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {analytics?.totalRooms
                  ? `${Math.round(((analytics.occupiedRooms || 0) / analytics.totalRooms) * 100)}%`
                  : "0%"} {bilingualText("occupancy rate", "ఆక్రమణ రేటు")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {bilingualText("Today's Activity", "నేటి కార్యకలాపాలు")}
            </CardTitle>
            <CardDescription>
              {bilingualText("Summary of today's transactions", "నేటి లావాదేవీల సారాంశం")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {bilingualText("Payments Received", "స్వీకరించిన చెల్లింపులు")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {analytics?.todayPayments || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {bilingualText("Total Revenue", "మొత్తం ఆదాయం")}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {formatCurrency(analytics?.dailyRevenue || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}