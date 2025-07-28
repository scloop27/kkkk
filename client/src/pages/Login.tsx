import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { bilingualText } from "@/lib/utils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.reload();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username && password) {
      loginMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {bilingualText("Admin Login", "అడ్మిన్ లాగిన్")}
          </CardTitle>
          <CardDescription>
            {bilingualText(
              "Enter your credentials to access the lodge management system",
              "లాడ్జ్ మేనేజ్‌మెంట్ సిస్టమ్‌ను యాక్సెస్ చేయడానికి మీ వివరాలను నమోదు చేయండి"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                {bilingualText("Username", "వినియోగదారు పేరు")}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={bilingualText("Enter username", "వినియోగదారు పేరును నమోదు చేయండి")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {bilingualText("Password", "పాస్‌వర్డ్")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={bilingualText("Enter password", "పాస్‌వర్డ్‌ను నమోదు చేయండి")}
                required
              />
            </div>
            {error && (
              <div className="text-destructive text-sm">
                {error.includes("Invalid credentials") 
                  ? bilingualText("Invalid username or password", "తప్పుడు వినియోగదారు పేరు లేదా పాస్‌వర్డ్")
                  : error
                }
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? bilingualText("Signing in...", "సైన్ ఇన్ అవుతున్నది...")
                : bilingualText("Sign In", "సైన్ ఇన్")
              }
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {bilingualText("New to the system?", "సిస్టమ్‌కు కొత్తవా?")} {" "}
            <Link href="/setup" className="text-primary hover:underline">
              {bilingualText("Set up admin account", "అడ్మిన్ ఖాతాను సెటప్ చేయండి")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}