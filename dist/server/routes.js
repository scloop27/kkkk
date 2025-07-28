"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const storage_1 = require("./storage");
const auth_1 = require("./auth");
const schema_1 = require("../shared/schema");
async function registerRoutes(app) {
    // Auth middleware
    await (0, auth_1.setupAuth)(app);
    // Auth routes
    app.post('/api/auth/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Username and password required" });
            }
            const admin = await storage_1.storage.getAdminByUsername(username);
            if (!admin) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const isValid = await (0, auth_1.verifyPassword)(password, admin.passwordHash);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            req.session.adminId = admin.id;
            res.json({ success: true, admin: { id: admin.id, username: admin.username, email: admin.email } });
        }
        catch (error) {
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
    app.get('/api/auth/user', auth_1.isAuthenticated, async (req, res) => {
        res.json(req.admin);
    });
    // Admin setup (for initial admin creation)
    app.post('/api/setup/admin', async (req, res) => {
        try {
            // Check if any admin exists
            const existingAdmins = await storage_1.storage.getAdminByUsername(req.body.username);
            if (existingAdmins) {
                return res.status(400).json({ message: "Admin already exists" });
            }
            const validatedData = schema_1.insertAdminSchema.parse(req.body);
            const hashedPassword = await (0, auth_1.hashPassword)(validatedData.passwordHash);
            const admin = await storage_1.storage.createAdmin({
                ...validatedData,
                passwordHash: hashedPassword,
            });
            res.json({ success: true, admin: { id: admin.id, username: admin.username, email: admin.email } });
        }
        catch (error) {
            console.error("Admin setup error:", error);
            res.status(500).json({ message: "Failed to create admin" });
        }
    });
    // Lodge management routes
    app.get('/api/lodge', auth_1.isAuthenticated, async (req, res) => {
        try {
            const lodge = await storage_1.storage.getFirstLodge();
            res.json(lodge);
        }
        catch (error) {
            console.error("Get lodge error:", error);
            res.status(500).json({ message: "Failed to fetch lodge" });
        }
    });
    app.post('/api/lodge', auth_1.isAuthenticated, async (req, res) => {
        try {
            const validatedData = schema_1.insertLodgeSchema.parse(req.body);
            const lodge = await storage_1.storage.createLodge(validatedData);
            res.json(lodge);
        }
        catch (error) {
            console.error("Create lodge error:", error);
            res.status(500).json({ message: "Failed to create lodge" });
        }
    });
    app.put('/api/lodge/:id', auth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const validatedData = schema_1.insertLodgeSchema.partial().parse(req.body);
            const lodge = await storage_1.storage.updateLodge(id, validatedData);
            res.json(lodge);
        }
        catch (error) {
            console.error("Update lodge error:", error);
            res.status(500).json({ message: "Failed to update lodge" });
        }
    });
    // Room type routes
    app.get('/api/room-types', auth_1.isAuthenticated, async (req, res) => {
        try {
            const lodge = await storage_1.storage.getFirstLodge();
            if (!lodge) {
                return res.status(404).json({ message: "Lodge not found" });
            }
            const roomTypes = await storage_1.storage.getRoomTypes(lodge.id);
            res.json(roomTypes);
        }
        catch (error) {
            console.error("Get room types error:", error);
            res.status(500).json({ message: "Failed to fetch room types" });
        }
    });
    app.post('/api/room-types', auth_1.isAuthenticated, async (req, res) => {
        try {
            const validatedData = schema_1.insertRoomTypeSchema.parse(req.body);
            const roomType = await storage_1.storage.createRoomType(validatedData);
            res.json(roomType);
        }
        catch (error) {
            console.error("Create room type error:", error);
            res.status(500).json({ message: "Failed to create room type" });
        }
    });
    app.put('/api/room-types/:id', auth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const validatedData = schema_1.insertRoomTypeSchema.partial().parse(req.body);
            const roomType = await storage_1.storage.updateRoomType(id, validatedData);
            res.json(roomType);
        }
        catch (error) {
            console.error("Update room type error:", error);
            res.status(500).json({ message: "Failed to update room type" });
        }
    });
    app.delete('/api/room-types/:id', auth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            await storage_1.storage.deleteRoomType(id);
            res.json({ success: true });
        }
        catch (error) {
            console.error("Delete room type error:", error);
            res.status(500).json({ message: "Failed to delete room type" });
        }
    });
    // Room routes
    app.get('/api/rooms', auth_1.isAuthenticated, async (req, res) => {
        try {
            const lodge = await storage_1.storage.getFirstLodge();
            if (!lodge) {
                return res.status(404).json({ message: "Lodge not found" });
            }
            const rooms = await storage_1.storage.getRooms(lodge.id);
            res.json(rooms);
        }
        catch (error) {
            console.error("Get rooms error:", error);
            res.status(500).json({ message: "Failed to fetch rooms" });
        }
    });
    app.get('/api/rooms/available', auth_1.isAuthenticated, async (req, res) => {
        try {
            const { checkInDate, checkOutDate } = req.query;
            if (!checkInDate || !checkOutDate) {
                return res.status(400).json({ message: "Check-in and check-out dates required" });
            }
            const lodge = await storage_1.storage.getFirstLodge();
            if (!lodge) {
                return res.status(404).json({ message: "Lodge not found" });
            }
            const rooms = await storage_1.storage.getAvailableRooms(lodge.id, checkInDate, checkOutDate);
            res.json(rooms);
        }
        catch (error) {
            console.error("Get available rooms error:", error);
            res.status(500).json({ message: "Failed to fetch available rooms" });
        }
    });
    app.post('/api/rooms', auth_1.isAuthenticated, async (req, res) => {
        try {
            const validatedData = schema_1.insertRoomSchema.parse(req.body);
            const room = await storage_1.storage.createRoom(validatedData);
            res.json(room);
        }
        catch (error) {
            console.error("Create room error:", error);
            res.status(500).json({ message: "Failed to create room" });
        }
    });
    app.put('/api/rooms/:id', auth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const validatedData = schema_1.insertRoomSchema.partial().parse(req.body);
            const room = await storage_1.storage.updateRoom(id, validatedData);
            res.json(room);
        }
        catch (error) {
            console.error("Update room error:", error);
            res.status(500).json({ message: "Failed to update room" });
        }
    });
    // Guest routes
    app.get('/api/guests', auth_1.isAuthenticated, async (req, res) => {
        try {
            const guests = await storage_1.storage.getGuests();
            res.json(guests);
        }
        catch (error) {
            console.error("Get guests error:", error);
            res.status(500).json({ message: "Failed to fetch guests" });
        }
    });
    app.get('/api/guests/search', auth_1.isAuthenticated, async (req, res) => {
        try {
            const { phone, aadhar } = req.query;
            let guest = null;
            if (phone) {
                guest = await storage_1.storage.getGuestByPhone(phone);
            }
            else if (aadhar) {
                guest = await storage_1.storage.getGuestByAadhar(aadhar);
            }
            res.json(guest);
        }
        catch (error) {
            console.error("Search guest error:", error);
            res.status(500).json({ message: "Failed to search guest" });
        }
    });
    app.post('/api/guests', auth_1.isAuthenticated, async (req, res) => {
        try {
            const validatedData = schema_1.insertGuestSchema.parse(req.body);
            const guest = await storage_1.storage.createGuest(validatedData);
            res.json(guest);
        }
        catch (error) {
            console.error("Create guest error:", error);
            res.status(500).json({ message: "Failed to create guest" });
        }
    });
    // Booking routes
    app.get('/api/bookings', auth_1.isAuthenticated, async (req, res) => {
        try {
            const bookings = await storage_1.storage.getBookings();
            res.json(bookings);
        }
        catch (error) {
            console.error("Get bookings error:", error);
            res.status(500).json({ message: "Failed to fetch bookings" });
        }
    });
    app.get('/api/bookings/active', auth_1.isAuthenticated, async (req, res) => {
        try {
            const bookings = await storage_1.storage.getActiveBookings();
            res.json(bookings);
        }
        catch (error) {
            console.error("Get active bookings error:", error);
            res.status(500).json({ message: "Failed to fetch active bookings" });
        }
    });
    app.post('/api/bookings', auth_1.isAuthenticated, async (req, res) => {
        try {
            const validatedData = schema_1.insertBookingSchema.parse(req.body);
            const booking = await storage_1.storage.createBooking(validatedData);
            // Update room status to occupied
            await storage_1.storage.updateRoom(validatedData.roomId, { status: 'occupied' });
            res.json(booking);
        }
        catch (error) {
            console.error("Create booking error:", error);
            res.status(500).json({ message: "Failed to create booking" });
        }
    });
    app.put('/api/bookings/:id', auth_1.isAuthenticated, async (req, res) => {
        try {
            const { id } = req.params;
            const validatedData = schema_1.insertBookingSchema.partial().parse(req.body);
            const booking = await storage_1.storage.updateBooking(id, validatedData);
            res.json(booking);
        }
        catch (error) {
            console.error("Update booking error:", error);
            res.status(500).json({ message: "Failed to update booking" });
        }
    });
    // Payment routes
    app.post('/api/payments', auth_1.isAuthenticated, async (req, res) => {
        try {
            const validatedData = schema_1.insertPaymentSchema.parse(req.body);
            const payment = await storage_1.storage.createPayment(validatedData);
            res.json(payment);
        }
        catch (error) {
            console.error("Create payment error:", error);
            res.status(500).json({ message: "Failed to create payment" });
        }
    });
    // Bill routes
    app.post('/api/bills', auth_1.isAuthenticated, async (req, res) => {
        try {
            const validatedData = schema_1.insertBillSchema.parse(req.body);
            const bill = await storage_1.storage.createBill(validatedData);
            res.json(bill);
        }
        catch (error) {
            console.error("Create bill error:", error);
            res.status(500).json({ message: "Failed to create bill" });
        }
    });
    // Analytics routes
    app.get('/api/analytics/dashboard', auth_1.isAuthenticated, async (req, res) => {
        try {
            const lodge = await storage_1.storage.getFirstLodge();
            if (!lodge) {
                return res.status(404).json({ message: "Lodge not found" });
            }
            const rooms = await storage_1.storage.getRooms(lodge.id);
            const activeBookings = await storage_1.storage.getActiveBookings();
            const payments = await storage_1.storage.getPayments();
            // Calculate room availability
            const totalRooms = rooms.length;
            const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
            const availableRooms = totalRooms - occupiedRooms;
            // Calculate daily revenue (today)
            const today = new Date().toISOString().split('T')[0];
            const todayPayments = payments.filter(payment => payment.paymentDate &&
                payment.paymentDate.toISOString().split('T')[0] === today);
            const dailyRevenue = todayPayments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);
            res.json({
                totalRooms,
                availableRooms,
                occupiedRooms,
                activeBookings: activeBookings.length,
                dailyRevenue,
                todayPayments: todayPayments.length,
            });
        }
        catch (error) {
            console.error("Get analytics error:", error);
            res.status(500).json({ message: "Failed to fetch analytics" });
        }
    });
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
