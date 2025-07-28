import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, verifyPassword } from "./auth";
import { 
  insertAdminSchema, 
  insertLodgeSchema, 
  insertRoomTypeSchema, 
  insertRoomSchema,
  insertGuestSchema,
  insertBookingSchema,
  insertPaymentSchema,
  insertBillSchema 
} from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      res.json({ success: true, admin: { id: admin.id, username: admin.username, email: admin.email } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    res.json(req.admin);
  });

  // Admin setup (for initial admin creation)
  app.post('/api/setup/admin', async (req, res) => {
    try {
      // Check if any admin exists
      const existingAdmins = await storage.getAdminByUsername(req.body.username);
      if (existingAdmins) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const validatedData = insertAdminSchema.parse(req.body);
      const hashedPassword = await hashPassword(validatedData.passwordHash);
      
      const admin = await storage.createAdmin({
        ...validatedData,
        passwordHash: hashedPassword,
      });

      res.json({ success: true, admin: { id: admin.id, username: admin.username, email: admin.email } });
    } catch (error) {
      console.error("Admin setup error:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

  // Lodge management routes
  app.get('/api/lodge', isAuthenticated, async (req, res) => {
    try {
      const lodge = await storage.getFirstLodge();
      res.json(lodge);
    } catch (error) {
      console.error("Get lodge error:", error);
      res.status(500).json({ message: "Failed to fetch lodge" });
    }
  });

  app.post('/api/lodge', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLodgeSchema.parse(req.body);
      const lodge = await storage.createLodge(validatedData);
      res.json(lodge);
    } catch (error) {
      console.error("Create lodge error:", error);
      res.status(500).json({ message: "Failed to create lodge" });
    }
  });

  app.put('/api/lodge/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertLodgeSchema.partial().parse(req.body);
      const lodge = await storage.updateLodge(id, validatedData);
      res.json(lodge);
    } catch (error) {
      console.error("Update lodge error:", error);
      res.status(500).json({ message: "Failed to update lodge" });
    }
  });

  // Room type routes
  app.get('/api/room-types', isAuthenticated, async (req, res) => {
    try {
      const lodge = await storage.getFirstLodge();
      if (!lodge) {
        return res.status(404).json({ message: "Lodge not found" });
      }
      const roomTypes = await storage.getRoomTypes(lodge.id);
      res.json(roomTypes);
    } catch (error) {
      console.error("Get room types error:", error);
      res.status(500).json({ message: "Failed to fetch room types" });
    }
  });

  app.post('/api/room-types', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertRoomTypeSchema.parse(req.body);
      const roomType = await storage.createRoomType(validatedData);
      res.json(roomType);
    } catch (error) {
      console.error("Create room type error:", error);
      res.status(500).json({ message: "Failed to create room type" });
    }
  });

  app.put('/api/room-types/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertRoomTypeSchema.partial().parse(req.body);
      const roomType = await storage.updateRoomType(id, validatedData);
      res.json(roomType);
    } catch (error) {
      console.error("Update room type error:", error);
      res.status(500).json({ message: "Failed to update room type" });
    }
  });

  app.delete('/api/room-types/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRoomType(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete room type error:", error);
      res.status(500).json({ message: "Failed to delete room type" });
    }
  });

  // Room routes
  app.get('/api/rooms', isAuthenticated, async (req, res) => {
    try {
      const lodge = await storage.getFirstLodge();
      if (!lodge) {
        return res.status(404).json({ message: "Lodge not found" });
      }
      const rooms = await storage.getRooms(lodge.id);
      res.json(rooms);
    } catch (error) {
      console.error("Get rooms error:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.get('/api/rooms/available', isAuthenticated, async (req, res) => {
    try {
      const { checkInDate, checkOutDate } = req.query;
      
      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ message: "Check-in and check-out dates required" });
      }

      const lodge = await storage.getFirstLodge();
      if (!lodge) {
        return res.status(404).json({ message: "Lodge not found" });
      }

      const rooms = await storage.getAvailableRooms(lodge.id, checkInDate as string, checkOutDate as string);
      res.json(rooms);
    } catch (error) {
      console.error("Get available rooms error:", error);
      res.status(500).json({ message: "Failed to fetch available rooms" });
    }
  });

  app.post('/api/rooms', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(validatedData);
      res.json(room);
    } catch (error) {
      console.error("Create room error:", error);
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  app.put('/api/rooms/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertRoomSchema.partial().parse(req.body);
      const room = await storage.updateRoom(id, validatedData);
      res.json(room);
    } catch (error) {
      console.error("Update room error:", error);
      res.status(500).json({ message: "Failed to update room" });
    }
  });

  // Guest routes
  app.get('/api/guests', isAuthenticated, async (req, res) => {
    try {
      const guests = await storage.getGuests();
      res.json(guests);
    } catch (error) {
      console.error("Get guests error:", error);
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  app.get('/api/guests/search', isAuthenticated, async (req, res) => {
    try {
      const { phone, aadhar } = req.query;
      
      let guest = null;
      if (phone) {
        guest = await storage.getGuestByPhone(phone as string);
      } else if (aadhar) {
        guest = await storage.getGuestByAadhar(aadhar as string);
      }
      
      res.json(guest);
    } catch (error) {
      console.error("Search guest error:", error);
      res.status(500).json({ message: "Failed to search guest" });
    }
  });

  app.post('/api/guests', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertGuestSchema.parse(req.body);
      const guest = await storage.createGuest(validatedData);
      res.json(guest);
    } catch (error) {
      console.error("Create guest error:", error);
      res.status(500).json({ message: "Failed to create guest" });
    }
  });

  // Booking routes
  app.get('/api/bookings', isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/bookings/active', isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getActiveBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Get active bookings error:", error);
      res.status(500).json({ message: "Failed to fetch active bookings" });
    }
  });

  app.post('/api/bookings', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      
      // Update room status to occupied
      await storage.updateRoom(validatedData.roomId, { status: 'occupied' });
      
      res.json(booking);
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.put('/api/bookings/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(id, validatedData);
      res.json(booking);
    } catch (error) {
      console.error("Update booking error:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Payment routes
  app.post('/api/payments', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.json(payment);
    } catch (error) {
      console.error("Create payment error:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // Bill routes
  app.post('/api/bills', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(validatedData);
      res.json(bill);
    } catch (error) {
      console.error("Create bill error:", error);
      res.status(500).json({ message: "Failed to create bill" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/dashboard', isAuthenticated, async (req, res) => {
    try {
      const lodge = await storage.getFirstLodge();
      if (!lodge) {
        return res.status(404).json({ message: "Lodge not found" });
      }

      const rooms = await storage.getRooms(lodge.id);
      const activeBookings = await storage.getActiveBookings();
      const payments = await storage.getPayments();

      // Calculate room availability
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
      const availableRooms = totalRooms - occupiedRooms;

      // Calculate daily revenue (today)
      const today = new Date().toISOString().split('T')[0];
      const todayPayments = payments.filter(payment => 
        payment.paymentDate && 
        payment.paymentDate.toISOString().split('T')[0] === today
      );
      const dailyRevenue = todayPayments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);

      res.json({
        totalRooms,
        availableRooms,
        occupiedRooms,
        activeBookings: activeBookings.length,
        dailyRevenue,
        todayPayments: todayPayments.length,
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}