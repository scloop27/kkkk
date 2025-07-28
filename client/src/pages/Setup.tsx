import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { bilingualText } from "@/lib/utils";

export default function Setup() {
  const [formData, setFormData] = useState({
    username: "",
    passwordHash: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");

  const setupMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/setup/admin", {
        method: "POST",
        body: JSON.stringify(formData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Auto-login after setup
      apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username,
          password: formData.passwordHash,
        }),
      }).then(() => {
        window.location.reload();
      });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.passwordHash !== formData.confirmPassword) {
      setError(bilingualText("Passwords do not match", "పాస్‌వర్డ్‌లు సరిపోలలేదు"));
      return;
    }
    
    if (formData.passwordHash.length < 6) {
      setError(bilingualText("Password must be at least 6 characters", "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి"));
      return;
    }
    
    setupMutation.mutate();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {bilingualText("Setup Admin Account", "అడ్మిన్ ఖాతా సెటప్")}
          </CardTitle>
          <CardDescription>
            {bilingualText(
              "Create the first admin account for your lodge management system",
              "మీ లాడ్జ్ మేనేజ్‌మెంట్ సిస్టమ్ కోసం మొదటి అడ్మిన్ ఖాతాను సృష్టించండి"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {bilingualText("First Name", "మొదటి పేరు")}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder={bilingualText("First name", "మొదటి పేరు")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {bilingualText("Last Name", "చివరి పేరు")}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder={bilingualText("Last name", "చివరి పేరు")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">
                {bilingualText("Username", "వినియోగదారు పేరు")} *
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder={bilingualText("Choose a username", "వినియోగదారు పేరును ఎంచుకోండి")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {bilingualText("Email", "ఇమెయిల్")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={bilingualText("Email address", "ఇమెయిల్ చిరునామా")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {bilingualText("Password", "పాస్‌వర్డ్")} *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.passwordHash}
                onChange={(e) => handleChange("passwordHash", e.target.value)}
                placeholder={bilingualText("Create a password", "పాస్‌వర్డ్‌ను సృష్టించండి")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {bilingualText("Confirm Password", "పాస్‌వర్డ్‌ను నిర్ధారించండి")} *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder={bilingualText("Confirm your password", "మీ పాస్‌వర్డ్‌ను నిర్ధారించండి")}
                required
              />
            </div>
            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={setupMutation.isPending}
            >
              {setupMutation.isPending
                ? bilingualText("Setting up...", "సెటప్ చేస్తున్నది...")
                : bilingualText("Create Admin Account", "అడ్మిన్ ఖాతాను సృష్టించండి")
              }
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {bilingualText("Already have an account?", "ఇప్పటికే ఖాతా ఉందా?")} {" "}
            <Link href="/" className="text-primary hover:underline">
              {bilingualText("Sign in", "సైన్ ఇన్")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}