import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, User, Phone, CreditCard, Search } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { bilingualText, formatDate } from "@/lib/utils";
import type { Guest } from "@shared/schema";

export default function Guests() {
  const [showNewGuest, setShowNewGuest] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: guests, isLoading } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const filteredGuests = guests?.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm) ||
    (guest.aadharNumber && guest.aadharNumber.includes(searchTerm))
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {bilingualText("Guests", "అతిథులు")}
        </h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {bilingualText("Guests", "అతిథులు")}
        </h1>
        <Button onClick={() => setShowNewGuest(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {bilingualText("Add Guest", "అతిథిని జోడించండి")}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={bilingualText("Search by name, phone, or Aadhar", "పేరు, ఫోన్ లేదా ఆధార్ ద్వారా వెతకండి")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {showNewGuest && (
        <Card>
          <CardHeader>
            <CardTitle>
              {bilingualText("Add New Guest", "కొత్త అతిథిని జోడించండి")}
            </CardTitle>
            <CardDescription>
              {bilingualText("Register a new guest with their details", "కొత్త అతిథిని వారి వివరాలతో నమోదు చేయండి")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GuestForm 
              onCancel={() => setShowNewGuest(false)}
              onSuccess={() => setShowNewGuest(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredGuests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm 
                  ? bilingualText("No guests found", "అతিథులు కనుగొనబడలేదు")
                  : bilingualText("No guests registered", "అతిథులు నమోదు చేయబడలేదు")
                }
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? bilingualText("Try adjusting your search terms", "మీ వెతుకుట పదాలను సర్దుబాటు చేయడానికి ప్రయత్నించండి")
                  : bilingualText("Start by adding your first guest", "మీ మొదటి అతిథిని జోడించడం ద్వారా ప్రారంభించండి")
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))
        )}
      </div>
    </div>
  );
}

interface GuestFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

function GuestForm({ onCancel, onSuccess }: GuestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadharNumber: "",
    email: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const createGuestMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/guests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGuestMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            {bilingualText("Name", "పేరు")} *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={bilingualText("Full name", "పూర్తి పేరు")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            {bilingualText("Phone Number", "ఫోన్ నంబర్")} *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="9876543210"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aadharNumber">
            {bilingualText("Aadhar Number", "ఆధార్ నంబర్")}
          </Label>
          <Input
            id="aadharNumber"
            value={formData.aadharNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, aadharNumber: e.target.value }))}
            placeholder="1234 5678 9012"
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
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="guest@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          {bilingualText("Address", "చిరునామా")}
        </Label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder={bilingualText("Full address", "పూర్తి చిరునామా")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">
            {bilingualText("Emergency Contact Name", "అత్యవసర సంపర్క పేరు")}
          </Label>
          <Input
            id="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
            placeholder={bilingualText("Contact person name", "సంపర్క వ్యక్తి పేరు")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">
            {bilingualText("Emergency Contact Phone", "అత్యవసర సంపర్క ఫోన్")}
          </Label>
          <Input
            id="emergencyContactPhone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
            placeholder="9876543210"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {bilingualText("Cancel", "రద్దు చేయండి")}
        </Button>
        <Button type="submit" disabled={createGuestMutation.isPending}>
          {createGuestMutation.isPending 
            ? bilingualText("Adding...", "జోడిస్తున్నది...")
            : bilingualText("Add Guest", "అతిథిని జోడించండి")
          }
        </Button>
      </div>
    </form>
  );
}

interface GuestCardProps {
  guest: Guest;
}

function GuestCard({ guest }: GuestCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-4 h-4 mr-2" />
              {guest.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Phone className="w-3 h-3 mr-1" />
              {guest.phone}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {bilingualText("Registered", "నమోదు చేయబడింది")}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(guest.createdAt || new Date())}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guest.aadharNumber && (
            <div>
              <Label className="text-xs text-muted-foreground flex items-center">
                <CreditCard className="w-3 h-3 mr-1" />
                {bilingualText("Aadhar Number", "ఆధార్ నంబర్")}
              </Label>
              <div className="text-sm">{guest.aadharNumber}</div>
            </div>
          )}

          {guest.email && (
            <div>
              <Label className="text-xs text-muted-foreground">
                {bilingualText("Email", "ఇమెయిల్")}
              </Label>
              <div className="text-sm">{guest.email}</div>
            </div>
          )}

          {guest.address && (
            <div className="md:col-span-2">
              <Label className="text-xs text-muted-foreground">
                {bilingualText("Address", "చిరునామా")}
              </Label>
              <div className="text-sm">{guest.address}</div>
            </div>
          )}

          {guest.emergencyContactName && (
            <div>
              <Label className="text-xs text-muted-foreground">
                {bilingualText("Emergency Contact", "అత్యవసర సంపర్కం")}
              </Label>
              <div className="text-sm">
                {guest.emergencyContactName}
                {guest.emergencyContactPhone && ` - ${guest.emergencyContactPhone}`}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}