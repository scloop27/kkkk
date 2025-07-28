var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createServer } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, verifyPassword } from "./auth";
import { insertAdminSchema, insertLodgeSchema, insertRoomTypeSchema, insertRoomSchema, insertGuestSchema, insertBookingSchema, insertPaymentSchema, insertBillSchema } from "../shared/schema";
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Auth middleware
                return [4 /*yield*/, setupAuth(app)];
                case 1:
                    // Auth middleware
                    _a.sent();
                    // Auth routes
                    app.post('/api/auth/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, username, password, admin, isValid, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    _a = req.body, username = _a.username, password = _a.password;
                                    if (!username || !password) {
                                        return [2 /*return*/, res.status(400).json({ message: "Username and password required" })];
                                    }
                                    return [4 /*yield*/, storage.getAdminByUsername(username)];
                                case 1:
                                    admin = _b.sent();
                                    if (!admin) {
                                        return [2 /*return*/, res.status(401).json({ message: "Invalid credentials" })];
                                    }
                                    return [4 /*yield*/, verifyPassword(password, admin.passwordHash)];
                                case 2:
                                    isValid = _b.sent();
                                    if (!isValid) {
                                        return [2 /*return*/, res.status(401).json({ message: "Invalid credentials" })];
                                    }
                                    req.session.adminId = admin.id;
                                    res.json({ success: true, admin: { id: admin.id, username: admin.username, email: admin.email } });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _b.sent();
                                    console.error("Login error:", error_1);
                                    res.status(500).json({ message: "Internal server error" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/auth/logout', function (req, res) {
                        req.session.destroy(function (err) {
                            if (err) {
                                console.error('Logout error:', err);
                                return res.status(500).json({ message: "Logout failed" });
                            }
                            res.json({ success: true });
                        });
                    });
                    app.get('/api/auth/user', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            res.json(req.admin);
                            return [2 /*return*/];
                        });
                    }); });
                    // Admin setup (for initial admin creation)
                    app.post('/api/setup/admin', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var existingAdmins, validatedData, hashedPassword, admin, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, storage.getAdminByUsername(req.body.username)];
                                case 1:
                                    existingAdmins = _a.sent();
                                    if (existingAdmins) {
                                        return [2 /*return*/, res.status(400).json({ message: "Admin already exists" })];
                                    }
                                    validatedData = insertAdminSchema.parse(req.body);
                                    return [4 /*yield*/, hashPassword(validatedData.passwordHash)];
                                case 2:
                                    hashedPassword = _a.sent();
                                    return [4 /*yield*/, storage.createAdmin(__assign(__assign({}, validatedData), { passwordHash: hashedPassword }))];
                                case 3:
                                    admin = _a.sent();
                                    res.json({ success: true, admin: { id: admin.id, username: admin.username, email: admin.email } });
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_2 = _a.sent();
                                    console.error("Admin setup error:", error_2);
                                    res.status(500).json({ message: "Failed to create admin" });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Lodge management routes
                    app.get('/api/lodge', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var lodge, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getFirstLodge()];
                                case 1:
                                    lodge = _a.sent();
                                    res.json(lodge);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_3 = _a.sent();
                                    console.error("Get lodge error:", error_3);
                                    res.status(500).json({ message: "Failed to fetch lodge" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/lodge', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validatedData, lodge, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    validatedData = insertLodgeSchema.parse(req.body);
                                    return [4 /*yield*/, storage.createLodge(validatedData)];
                                case 1:
                                    lodge = _a.sent();
                                    res.json(lodge);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_4 = _a.sent();
                                    console.error("Create lodge error:", error_4);
                                    res.status(500).json({ message: "Failed to create lodge" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.put('/api/lodge/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, validatedData, lodge, error_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    validatedData = insertLodgeSchema.partial().parse(req.body);
                                    return [4 /*yield*/, storage.updateLodge(id, validatedData)];
                                case 1:
                                    lodge = _a.sent();
                                    res.json(lodge);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_5 = _a.sent();
                                    console.error("Update lodge error:", error_5);
                                    res.status(500).json({ message: "Failed to update lodge" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Room type routes
                    app.get('/api/room-types', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var lodge, roomTypes, error_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, storage.getFirstLodge()];
                                case 1:
                                    lodge = _a.sent();
                                    if (!lodge) {
                                        return [2 /*return*/, res.status(404).json({ message: "Lodge not found" })];
                                    }
                                    return [4 /*yield*/, storage.getRoomTypes(lodge.id)];
                                case 2:
                                    roomTypes = _a.sent();
                                    res.json(roomTypes);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_6 = _a.sent();
                                    console.error("Get room types error:", error_6);
                                    res.status(500).json({ message: "Failed to fetch room types" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/room-types', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validatedData, roomType, error_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    validatedData = insertRoomTypeSchema.parse(req.body);
                                    return [4 /*yield*/, storage.createRoomType(validatedData)];
                                case 1:
                                    roomType = _a.sent();
                                    res.json(roomType);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_7 = _a.sent();
                                    console.error("Create room type error:", error_7);
                                    res.status(500).json({ message: "Failed to create room type" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.put('/api/room-types/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, validatedData, roomType, error_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    validatedData = insertRoomTypeSchema.partial().parse(req.body);
                                    return [4 /*yield*/, storage.updateRoomType(id, validatedData)];
                                case 1:
                                    roomType = _a.sent();
                                    res.json(roomType);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_8 = _a.sent();
                                    console.error("Update room type error:", error_8);
                                    res.status(500).json({ message: "Failed to update room type" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.delete('/api/room-types/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, error_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    return [4 /*yield*/, storage.deleteRoomType(id)];
                                case 1:
                                    _a.sent();
                                    res.json({ success: true });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_9 = _a.sent();
                                    console.error("Delete room type error:", error_9);
                                    res.status(500).json({ message: "Failed to delete room type" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Room routes
                    app.get('/api/rooms', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var lodge, rooms, error_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, storage.getFirstLodge()];
                                case 1:
                                    lodge = _a.sent();
                                    if (!lodge) {
                                        return [2 /*return*/, res.status(404).json({ message: "Lodge not found" })];
                                    }
                                    return [4 /*yield*/, storage.getRooms(lodge.id)];
                                case 2:
                                    rooms = _a.sent();
                                    res.json(rooms);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_10 = _a.sent();
                                    console.error("Get rooms error:", error_10);
                                    res.status(500).json({ message: "Failed to fetch rooms" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/rooms/available', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, checkInDate, checkOutDate, lodge, rooms, error_11;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    _a = req.query, checkInDate = _a.checkInDate, checkOutDate = _a.checkOutDate;
                                    if (!checkInDate || !checkOutDate) {
                                        return [2 /*return*/, res.status(400).json({ message: "Check-in and check-out dates required" })];
                                    }
                                    return [4 /*yield*/, storage.getFirstLodge()];
                                case 1:
                                    lodge = _b.sent();
                                    if (!lodge) {
                                        return [2 /*return*/, res.status(404).json({ message: "Lodge not found" })];
                                    }
                                    return [4 /*yield*/, storage.getAvailableRooms(lodge.id, checkInDate, checkOutDate)];
                                case 2:
                                    rooms = _b.sent();
                                    res.json(rooms);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_11 = _b.sent();
                                    console.error("Get available rooms error:", error_11);
                                    res.status(500).json({ message: "Failed to fetch available rooms" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/rooms', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validatedData, room, error_12;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    validatedData = insertRoomSchema.parse(req.body);
                                    return [4 /*yield*/, storage.createRoom(validatedData)];
                                case 1:
                                    room = _a.sent();
                                    res.json(room);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_12 = _a.sent();
                                    console.error("Create room error:", error_12);
                                    res.status(500).json({ message: "Failed to create room" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.put('/api/rooms/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, validatedData, room, error_13;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    validatedData = insertRoomSchema.partial().parse(req.body);
                                    return [4 /*yield*/, storage.updateRoom(id, validatedData)];
                                case 1:
                                    room = _a.sent();
                                    res.json(room);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_13 = _a.sent();
                                    console.error("Update room error:", error_13);
                                    res.status(500).json({ message: "Failed to update room" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Guest routes
                    app.get('/api/guests', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var guests, error_14;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getGuests()];
                                case 1:
                                    guests = _a.sent();
                                    res.json(guests);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_14 = _a.sent();
                                    console.error("Get guests error:", error_14);
                                    res.status(500).json({ message: "Failed to fetch guests" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/guests/search', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, phone, aadhar, guest, error_15;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, , 6]);
                                    _a = req.query, phone = _a.phone, aadhar = _a.aadhar;
                                    guest = null;
                                    if (!phone) return [3 /*break*/, 2];
                                    return [4 /*yield*/, storage.getGuestByPhone(phone)];
                                case 1:
                                    guest = _b.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    if (!aadhar) return [3 /*break*/, 4];
                                    return [4 /*yield*/, storage.getGuestByAadhar(aadhar)];
                                case 3:
                                    guest = _b.sent();
                                    _b.label = 4;
                                case 4:
                                    res.json(guest);
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_15 = _b.sent();
                                    console.error("Search guest error:", error_15);
                                    res.status(500).json({ message: "Failed to search guest" });
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/guests', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validatedData, guest, error_16;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    validatedData = insertGuestSchema.parse(req.body);
                                    return [4 /*yield*/, storage.createGuest(validatedData)];
                                case 1:
                                    guest = _a.sent();
                                    res.json(guest);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_16 = _a.sent();
                                    console.error("Create guest error:", error_16);
                                    res.status(500).json({ message: "Failed to create guest" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Booking routes
                    app.get('/api/bookings', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var bookings, error_17;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getBookings()];
                                case 1:
                                    bookings = _a.sent();
                                    res.json(bookings);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_17 = _a.sent();
                                    console.error("Get bookings error:", error_17);
                                    res.status(500).json({ message: "Failed to fetch bookings" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/bookings/active', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var bookings, error_18;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getActiveBookings()];
                                case 1:
                                    bookings = _a.sent();
                                    res.json(bookings);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_18 = _a.sent();
                                    console.error("Get active bookings error:", error_18);
                                    res.status(500).json({ message: "Failed to fetch active bookings" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/bookings', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validatedData, booking, error_19;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    validatedData = insertBookingSchema.parse(req.body);
                                    return [4 /*yield*/, storage.createBooking(validatedData)];
                                case 1:
                                    booking = _a.sent();
                                    // Update room status to occupied
                                    return [4 /*yield*/, storage.updateRoom(validatedData.roomId, { status: 'occupied' })];
                                case 2:
                                    // Update room status to occupied
                                    _a.sent();
                                    res.json(booking);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_19 = _a.sent();
                                    console.error("Create booking error:", error_19);
                                    res.status(500).json({ message: "Failed to create booking" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.put('/api/bookings/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, validatedData, booking, error_20;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    validatedData = insertBookingSchema.partial().parse(req.body);
                                    return [4 /*yield*/, storage.updateBooking(id, validatedData)];
                                case 1:
                                    booking = _a.sent();
                                    res.json(booking);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_20 = _a.sent();
                                    console.error("Update booking error:", error_20);
                                    res.status(500).json({ message: "Failed to update booking" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Payment routes
                    app.post('/api/payments', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validatedData, payment, error_21;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    validatedData = insertPaymentSchema.parse(req.body);
                                    return [4 /*yield*/, storage.createPayment(validatedData)];
                                case 1:
                                    payment = _a.sent();
                                    res.json(payment);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_21 = _a.sent();
                                    console.error("Create payment error:", error_21);
                                    res.status(500).json({ message: "Failed to create payment" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Bill routes
                    app.post('/api/bills', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var validatedData, bill, error_22;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    validatedData = insertBillSchema.parse(req.body);
                                    return [4 /*yield*/, storage.createBill(validatedData)];
                                case 1:
                                    bill = _a.sent();
                                    res.json(bill);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_22 = _a.sent();
                                    console.error("Create bill error:", error_22);
                                    res.status(500).json({ message: "Failed to create bill" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Analytics routes
                    app.get('/api/analytics/dashboard', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var lodge, rooms, activeBookings, payments, totalRooms, occupiedRooms, availableRooms, today_1, todayPayments, dailyRevenue, error_23;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    return [4 /*yield*/, storage.getFirstLodge()];
                                case 1:
                                    lodge = _a.sent();
                                    if (!lodge) {
                                        return [2 /*return*/, res.status(404).json({ message: "Lodge not found" })];
                                    }
                                    return [4 /*yield*/, storage.getRooms(lodge.id)];
                                case 2:
                                    rooms = _a.sent();
                                    return [4 /*yield*/, storage.getActiveBookings()];
                                case 3:
                                    activeBookings = _a.sent();
                                    return [4 /*yield*/, storage.getPayments()];
                                case 4:
                                    payments = _a.sent();
                                    totalRooms = rooms.length;
                                    occupiedRooms = rooms.filter(function (room) { return room.status === 'occupied'; }).length;
                                    availableRooms = totalRooms - occupiedRooms;
                                    today_1 = new Date().toISOString().split('T')[0];
                                    todayPayments = payments.filter(function (payment) {
                                        return payment.paymentDate &&
                                            payment.paymentDate.toISOString().split('T')[0] === today_1;
                                    });
                                    dailyRevenue = todayPayments.reduce(function (sum, payment) { return sum + parseFloat(payment.amount.toString()); }, 0);
                                    res.json({
                                        totalRooms: totalRooms,
                                        availableRooms: availableRooms,
                                        occupiedRooms: occupiedRooms,
                                        activeBookings: activeBookings.length,
                                        dailyRevenue: dailyRevenue,
                                        todayPayments: todayPayments.length,
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_23 = _a.sent();
                                    console.error("Get analytics error:", error_23);
                                    res.status(500).json({ message: "Failed to fetch analytics" });
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    httpServer = createServer(app);
                    return [2 /*return*/, httpServer];
            }
        });
    });
}
