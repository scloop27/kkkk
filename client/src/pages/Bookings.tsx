import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, User, Building } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { bilingualText, formatDate, formatCurrency, calculateDays } from "@/lib/utils";
import type { Booking, Guest, Room, RoomType } from "@shared/schema";

export default function Bookings() {
  const [showNewBooking, setShowNewBooking] = useState(false);

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: guests } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  if (bookingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {bilingualText("Bookings", "బుకింగ్‌లు")}
          </h1>
        </div>
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
          {bilingualText("Bookings", "బుకింగ్‌లు")}
        </h1>
        <Button onClick={() => setShowNewBooking(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {bilingualText("New Booking", "కొత్త బుకింగ్")}
        </Button>
      </div>

      {showNewBooking && (
        <Card>
          <CardHeader>
            <CardTitle>
              {bilingualText("Create New Booking", "కొత్త బుకింగ్ సృష్టించండి")}
            </CardTitle>
            <CardDescription>
              {bilingualText("Register a new guest and allocate room", "కొత్త అతిథిని నమోదు చేసి గదను కేటాయించండి")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm 
              guests={guests || []}
              rooms={rooms || []}
              onCancel={() => setShowNewBooking(false)}
              onSuccess={() => setShowNewBooking(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {bookings?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {bilingualText("No bookings found", "బుకింగ్‌లు కనుగొనబడలేదు")}
              </h3>
              <p className="text-muted-foreground">
                {bilingualText("Start by creating your first booking", "మీ మొదటి బుకింగ్‌ను సృష్టించడం ద్వారా ప్రారంభించండి")}
              </p>
            </CardContent>
          </Card>
        ) : (
          bookings?.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking}
              guests={guests || []}
              rooms={rooms || []}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface BookingFormProps {
  guests: Guest[];
  rooms: Room[];
  onCancel: () => void;
  onSuccess: () => void;
}

function BookingForm({ guests, rooms, onCancel, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    guestId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    roomPrice: "",
    taxAmount: "",
    totalAmount: "",
    notes: "",
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBookingMutation.mutate({
      ...formData,
      roomPrice: parseFloat(formData.roomPrice),
      taxAmount: parseFloat(formData.taxAmount || "0"),
      totalAmount: parseFloat(formData.totalAmount),
    });
  };

  // Calculate total when form data changes
  const updateTotal = () => {
    if (formData.checkInDate && formData.checkOutDate && formData.roomPrice) {
      const days = calculateDays(formData.checkInDate, formData.checkOutDate);
      const roomTotal = parseFloat(formData.roomPrice) * days;
      const tax = roomTotal * 0.12; // Assuming 12% tax
      const total = roomTotal + tax;
      
      setFormData(prev => ({
        ...prev,
        taxAmount: tax.toFixed(2),
        totalAmount: total.toFixed(2),
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guestId">
            {bilingualText("Guest", "అతిథి")} *
          </Label>
          <select
            id="guestId"
            value={formData.guestId}
            onChange={(e) => setFormData(prev => ({ ...prev, guestId: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">
              {bilingualText("Select a guest", "అతిథిని ఎంచుకోండి")}
            </option>
            {guests.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.name} - {guest.phone}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomId">
            {bilingualText("Room", "గది")} *
          </Label>
          <select
            id="roomId"
            value={formData.roomId}
            onChange={(e) => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">
              {bilingualText("Select a room", "గదిని ఎంచుకోండి")}
            </option>
            {rooms.filter(room => room.status === 'available').map((room) => (
              <option key={room.id} value={room.id}>
                {bilingualText("Room", "గది")} {room.roomNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="checkInDate">
            {bilingualText("Check-in Date", "చెక్-ఇన్ తేదీ")} *
          </Label>
          <Input
            id="checkInDate"
            type="date"
            value={formData.checkInDate}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, checkInDate: e.target.value }));
              setTimeout(updateTotal, 100);
            }}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkOutDate">
            {bilingualText("Check-out Date", "చెక్-ఔట్ తేదీ")} *
          </Label>
          <Input
            id="checkOutDate"
            type="date"
            value={formData.checkOutDate}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, checkOutDate: e.target.value }));
              setTimeout(updateTotal, 100);
            }}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="roomPrice">
            {bilingualText("Room Price/Day", "గది ధర/రోజు")} *
          </Label>
          <Input
            id="roomPrice"
            type="number"
            value={formData.roomPrice}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, roomPrice: e.target.value }));
              setTimeout(updateTotal, 100);
            }}
            placeholder="1000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxAmount">
            {bilingualText("Tax Amount", "పన్ను మొత్తం")}
          </Label>
          <Input
            id="taxAmount"
            type="number"
            value={formData.taxAmount}
            readOnly
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalAmount">
            {bilingualText("Total Amount", "మొత్తం మొత్తం")} *
          </Label>
          <Input
            id="totalAmount"
            type="number"
            value={formData.totalAmount}
            readOnly
            className="bg-muted font-bold"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">
          {bilingualText("Notes", "గమనికలు")}
        </Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder={bilingualText("Add any special notes", "ఏదైనా ప్రత్యేక గమనికలను జోడించండి")}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {bilingualText("Cancel", "రద్దు చేయండి")}
        </Button>
        <Button type="submit" disabled={createBookingMutation.isPending}>
          {createBookingMutation.isPending 
            ? bilingualText("Creating...", "సృష్టిస్తున్నది...")
            : bilingualText("Create Booking", "బుకింగ్ సృష్టించండి")
          }
        </Button>
      </div>
    </form>
  );
}

interface BookingCardProps {
  booking: Booking;
  guests: Guest[];
  rooms: Room[];
}

function BookingCard({ booking, guests, rooms }: BookingCardProps) {
  const guest = guests.find(g => g.id === booking.guestId);
  const room = rooms.find(r => r.id === booking.roomId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600';
      case 'checked_in': return 'text-green-600';
      case 'checked_out': return 'text-gray-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return bilingualText("Confirmed", "నిర్ధారించబడింది");
      case 'checked_in': return bilingualText("Checked In", "చెక్ ఇన్ అయింది");
      case 'checked_out': return bilingualText("Checked Out", "చెక్ అవుట్ అయింది");
      case 'cancelled': return bilingualText("Cancelled", "రద్దు చేయబడింది");
      default: return status;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-4 h-4 mr-2" />
              {guest?.name || bilingualText("Unknown Guest", "తెలియని అతిథి")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {guest?.phone} • {guest?.aadharNumber}
            </p>
          </div>
          <div className="text-right">
            <div className={`font-semibold ${getStatusColor(booking.status || 'confirmed')}`}>
              {getStatusText(booking.status || 'confirmed')}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(booking.createdAt || new Date())}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-xs text-muted-foreground">
              {bilingualText("Room", "గది")}
            </Label>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {room?.roomNumber || bilingualText("Unknown Room", "తెలియని గది")}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {bilingualText("Check-in", "చెక్-ఇన్")}
            </Label>
            <div>{formatDate(booking.checkInDate)}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {bilingualText("Check-out", "చెక్-ఔట్")}
            </Label>
            <div>{formatDate(booking.checkOutDate)}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {bilingualText("Total Amount", "మొత్తం మొత్తం")}
            </Label>
            <div className="font-semibold text-green-600">
              {formatCurrency(booking.totalAmount)}
            </div>
          </div>
        </div>

        {booking.notes && (
          <div>
            <Label className="text-xs text-muted-foreground">
              {bilingualText("Notes", "గమనికలు")}
            </Label>
            <p className="text-sm">{booking.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}