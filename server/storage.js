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
import { admins, lodges, roomTypes, rooms, guests, bookings, payments, bills, } from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte, ne } from "drizzle-orm";
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
    }
    // Admin operations
    DatabaseStorage.prototype.getAdmin = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var admin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(admins).where(eq(admins.id, id))];
                    case 1:
                        admin = (_a.sent())[0];
                        return [2 /*return*/, admin];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAdminByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var admin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(admins).where(eq(admins.username, username))];
                    case 1:
                        admin = (_a.sent())[0];
                        return [2 /*return*/, admin];
                }
            });
        });
    };
    DatabaseStorage.prototype.createAdmin = function (admin) {
        return __awaiter(this, void 0, void 0, function () {
            var newAdmin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(admins).values(admin).returning()];
                    case 1:
                        newAdmin = (_a.sent())[0];
                        return [2 /*return*/, newAdmin];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateAdmin = function (id, admin) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedAdmin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(admins)
                            .set(__assign(__assign({}, admin), { updatedAt: new Date() }))
                            .where(eq(admins.id, id))
                            .returning()];
                    case 1:
                        updatedAdmin = (_a.sent())[0];
                        return [2 /*return*/, updatedAdmin];
                }
            });
        });
    };
    // Lodge operations
    DatabaseStorage.prototype.getLodge = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var lodge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(lodges).where(eq(lodges.id, id))];
                    case 1:
                        lodge = (_a.sent())[0];
                        return [2 /*return*/, lodge];
                }
            });
        });
    };
    DatabaseStorage.prototype.getFirstLodge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lodge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(lodges).limit(1)];
                    case 1:
                        lodge = (_a.sent())[0];
                        return [2 /*return*/, lodge];
                }
            });
        });
    };
    DatabaseStorage.prototype.createLodge = function (lodge) {
        return __awaiter(this, void 0, void 0, function () {
            var newLodge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(lodges).values(lodge).returning()];
                    case 1:
                        newLodge = (_a.sent())[0];
                        return [2 /*return*/, newLodge];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateLodge = function (id, lodge) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedLodge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(lodges)
                            .set(__assign(__assign({}, lodge), { updatedAt: new Date() }))
                            .where(eq(lodges.id, id))
                            .returning()];
                    case 1:
                        updatedLodge = (_a.sent())[0];
                        return [2 /*return*/, updatedLodge];
                }
            });
        });
    };
    // Room Type operations
    DatabaseStorage.prototype.getRoomTypes = function (lodgeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(roomTypes).where(eq(roomTypes.lodgeId, lodgeId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRoomType = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var roomType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(roomTypes).where(eq(roomTypes.id, id))];
                    case 1:
                        roomType = (_a.sent())[0];
                        return [2 /*return*/, roomType];
                }
            });
        });
    };
    DatabaseStorage.prototype.createRoomType = function (roomType) {
        return __awaiter(this, void 0, void 0, function () {
            var newRoomType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(roomTypes).values(roomType).returning()];
                    case 1:
                        newRoomType = (_a.sent())[0];
                        return [2 /*return*/, newRoomType];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateRoomType = function (id, roomType) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedRoomType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(roomTypes)
                            .set(__assign(__assign({}, roomType), { updatedAt: new Date() }))
                            .where(eq(roomTypes.id, id))
                            .returning()];
                    case 1:
                        updatedRoomType = (_a.sent())[0];
                        return [2 /*return*/, updatedRoomType];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteRoomType = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.delete(roomTypes).where(eq(roomTypes.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Room operations
    DatabaseStorage.prototype.getRooms = function (lodgeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(rooms).where(eq(rooms.lodgeId, lodgeId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRoom = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(rooms).where(eq(rooms.id, id))];
                    case 1:
                        room = (_a.sent())[0];
                        return [2 /*return*/, room];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRoomsByType = function (roomTypeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(rooms).where(eq(rooms.roomTypeId, roomTypeId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAvailableRooms = function (lodgeId, checkInDate, checkOutDate) {
        return __awaiter(this, void 0, void 0, function () {
            var bookedRooms, bookedRoomIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select({ roomId: bookings.roomId })
                            .from(bookings)
                            .where(and(ne(bookings.status, "cancelled"), gte(bookings.checkOutDate, checkInDate), lte(bookings.checkInDate, checkOutDate)))];
                    case 1:
                        bookedRooms = _a.sent();
                        bookedRoomIds = bookedRooms.map(function (b) { return b.roomId; });
                        if (!(bookedRoomIds.length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, db.select().from(rooms).where(and(eq(rooms.lodgeId, lodgeId), eq(rooms.status, "available"), eq(rooms.isActive, true)))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, db.select().from(rooms).where(and(eq(rooms.lodgeId, lodgeId), eq(rooms.status, "available"), eq(rooms.isActive, true), 
                        // @ts-ignore - Drizzle typing issue with notIn
                        ne(rooms.id, bookedRoomIds[0])))];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createRoom = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var newRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(rooms).values(room).returning()];
                    case 1:
                        newRoom = (_a.sent())[0];
                        return [2 /*return*/, newRoom];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateRoom = function (id, room) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(rooms)
                            .set(__assign(__assign({}, room), { updatedAt: new Date() }))
                            .where(eq(rooms.id, id))
                            .returning()];
                    case 1:
                        updatedRoom = (_a.sent())[0];
                        return [2 /*return*/, updatedRoom];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteRoom = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.delete(rooms).where(eq(rooms.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Guest operations
    DatabaseStorage.prototype.getGuests = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(guests).orderBy(desc(guests.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getGuest = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var guest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(guests).where(eq(guests.id, id))];
                    case 1:
                        guest = (_a.sent())[0];
                        return [2 /*return*/, guest];
                }
            });
        });
    };
    DatabaseStorage.prototype.getGuestByPhone = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            var guest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(guests).where(eq(guests.phone, phone))];
                    case 1:
                        guest = (_a.sent())[0];
                        return [2 /*return*/, guest];
                }
            });
        });
    };
    DatabaseStorage.prototype.getGuestByAadhar = function (aadharNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var guest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(guests).where(eq(guests.aadharNumber, aadharNumber))];
                    case 1:
                        guest = (_a.sent())[0];
                        return [2 /*return*/, guest];
                }
            });
        });
    };
    DatabaseStorage.prototype.createGuest = function (guest) {
        return __awaiter(this, void 0, void 0, function () {
            var newGuest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(guests).values(guest).returning()];
                    case 1:
                        newGuest = (_a.sent())[0];
                        return [2 /*return*/, newGuest];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateGuest = function (id, guest) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedGuest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(guests)
                            .set(__assign(__assign({}, guest), { updatedAt: new Date() }))
                            .where(eq(guests.id, id))
                            .returning()];
                    case 1:
                        updatedGuest = (_a.sent())[0];
                        return [2 /*return*/, updatedGuest];
                }
            });
        });
    };
    // Booking operations
    DatabaseStorage.prototype.getBookings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bookings).orderBy(desc(bookings.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getBooking = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var booking;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bookings).where(eq(bookings.id, id))];
                    case 1:
                        booking = (_a.sent())[0];
                        return [2 /*return*/, booking];
                }
            });
        });
    };
    DatabaseStorage.prototype.getBookingsByGuest = function (guestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bookings).where(eq(bookings.guestId, guestId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getBookingsByRoom = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bookings).where(eq(bookings.roomId, roomId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getActiveBookings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bookings).where(ne(bookings.status, "cancelled"))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createBooking = function (booking) {
        return __awaiter(this, void 0, void 0, function () {
            var newBooking;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(bookings).values(booking).returning()];
                    case 1:
                        newBooking = (_a.sent())[0];
                        return [2 /*return*/, newBooking];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateBooking = function (id, booking) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedBooking;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(bookings)
                            .set(__assign(__assign({}, booking), { updatedAt: new Date() }))
                            .where(eq(bookings.id, id))
                            .returning()];
                    case 1:
                        updatedBooking = (_a.sent())[0];
                        return [2 /*return*/, updatedBooking];
                }
            });
        });
    };
    // Payment operations
    DatabaseStorage.prototype.getPayments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(payments).orderBy(desc(payments.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getPayment = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var payment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(payments).where(eq(payments.id, id))];
                    case 1:
                        payment = (_a.sent())[0];
                        return [2 /*return*/, payment];
                }
            });
        });
    };
    DatabaseStorage.prototype.getPaymentsByBooking = function (bookingId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(payments).where(eq(payments.bookingId, bookingId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createPayment = function (payment) {
        return __awaiter(this, void 0, void 0, function () {
            var newPayment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(payments).values(payment).returning()];
                    case 1:
                        newPayment = (_a.sent())[0];
                        return [2 /*return*/, newPayment];
                }
            });
        });
    };
    DatabaseStorage.prototype.updatePayment = function (id, payment) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedPayment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(payments)
                            .set(__assign(__assign({}, payment), { updatedAt: new Date() }))
                            .where(eq(payments.id, id))
                            .returning()];
                    case 1:
                        updatedPayment = (_a.sent())[0];
                        return [2 /*return*/, updatedPayment];
                }
            });
        });
    };
    // Bill operations
    DatabaseStorage.prototype.getBills = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bills).orderBy(desc(bills.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getBill = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var bill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bills).where(eq(bills.id, id))];
                    case 1:
                        bill = (_a.sent())[0];
                        return [2 /*return*/, bill];
                }
            });
        });
    };
    DatabaseStorage.prototype.getBillsByBooking = function (bookingId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(bills).where(eq(bills.bookingId, bookingId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createBill = function (bill) {
        return __awaiter(this, void 0, void 0, function () {
            var newBill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(bills).values(bill).returning()];
                    case 1:
                        newBill = (_a.sent())[0];
                        return [2 /*return*/, newBill];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateBill = function (id, bill) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedBill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(bills)
                            .set(__assign(__assign({}, bill), { updatedAt: new Date() }))
                            .where(eq(bills.id, id))
                            .returning()];
                    case 1:
                        updatedBill = (_a.sent())[0];
                        return [2 /*return*/, updatedBill];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
export var storage = new DatabaseStorage();
