"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
const schema_1 = require("../shared/schema");
const db_1 = require("./db");
const drizzle_orm_1 = require("drizzle-orm");
class DatabaseStorage {
    // Admin operations
    async getAdmin(id) {
        const [admin] = await db_1.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.id, id));
        return admin;
    }
    async getAdminByUsername(username) {
        const [admin] = await db_1.db.select().from(schema_1.admins).where((0, drizzle_orm_1.eq)(schema_1.admins.username, username));
        return admin;
    }
    async createAdmin(admin) {
        const [newAdmin] = await db_1.db.insert(schema_1.admins).values(admin).returning();
        return newAdmin;
    }
    async updateAdmin(id, admin) {
        const [updatedAdmin] = await db_1.db
            .update(schema_1.admins)
            .set({ ...admin, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.admins.id, id))
            .returning();
        return updatedAdmin;
    }
    // Lodge operations
    async getLodge(id) {
        const [lodge] = await db_1.db.select().from(schema_1.lodges).where((0, drizzle_orm_1.eq)(schema_1.lodges.id, id));
        return lodge;
    }
    async getFirstLodge() {
        const [lodge] = await db_1.db.select().from(schema_1.lodges).limit(1);
        return lodge;
    }
    async createLodge(lodge) {
        const [newLodge] = await db_1.db.insert(schema_1.lodges).values(lodge).returning();
        return newLodge;
    }
    async updateLodge(id, lodge) {
        const [updatedLodge] = await db_1.db
            .update(schema_1.lodges)
            .set({ ...lodge, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.lodges.id, id))
            .returning();
        return updatedLodge;
    }
    // Room Type operations
    async getRoomTypes(lodgeId) {
        return await db_1.db.select().from(schema_1.roomTypes).where((0, drizzle_orm_1.eq)(schema_1.roomTypes.lodgeId, lodgeId));
    }
    async getRoomType(id) {
        const [roomType] = await db_1.db.select().from(schema_1.roomTypes).where((0, drizzle_orm_1.eq)(schema_1.roomTypes.id, id));
        return roomType;
    }
    async createRoomType(roomType) {
        const [newRoomType] = await db_1.db.insert(schema_1.roomTypes).values(roomType).returning();
        return newRoomType;
    }
    async updateRoomType(id, roomType) {
        const [updatedRoomType] = await db_1.db
            .update(schema_1.roomTypes)
            .set({ ...roomType, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.roomTypes.id, id))
            .returning();
        return updatedRoomType;
    }
    async deleteRoomType(id) {
        await db_1.db.delete(schema_1.roomTypes).where((0, drizzle_orm_1.eq)(schema_1.roomTypes.id, id));
    }
    // Room operations
    async getRooms(lodgeId) {
        return await db_1.db.select().from(schema_1.rooms).where((0, drizzle_orm_1.eq)(schema_1.rooms.lodgeId, lodgeId));
    }
    async getRoom(id) {
        const [room] = await db_1.db.select().from(schema_1.rooms).where((0, drizzle_orm_1.eq)(schema_1.rooms.id, id));
        return room;
    }
    async getRoomsByType(roomTypeId) {
        return await db_1.db.select().from(schema_1.rooms).where((0, drizzle_orm_1.eq)(schema_1.rooms.roomTypeId, roomTypeId));
    }
    async getAvailableRooms(lodgeId, checkInDate, checkOutDate) {
        // Get rooms that are not booked during the specified period
        const bookedRooms = await db_1.db
            .select({ roomId: schema_1.bookings.roomId })
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(schema_1.bookings.status, "cancelled"), (0, drizzle_orm_1.gte)(schema_1.bookings.checkOutDate, checkInDate), (0, drizzle_orm_1.lte)(schema_1.bookings.checkInDate, checkOutDate)));
        const bookedRoomIds = bookedRooms.map(b => b.roomId);
        if (bookedRoomIds.length === 0) {
            return await db_1.db.select().from(schema_1.rooms).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.rooms.lodgeId, lodgeId), (0, drizzle_orm_1.eq)(schema_1.rooms.status, "available"), (0, drizzle_orm_1.eq)(schema_1.rooms.isActive, true)));
        }
        return await db_1.db.select().from(schema_1.rooms).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.rooms.lodgeId, lodgeId), (0, drizzle_orm_1.eq)(schema_1.rooms.status, "available"), (0, drizzle_orm_1.eq)(schema_1.rooms.isActive, true), 
        // @ts-ignore - Drizzle typing issue with notIn
        (0, drizzle_orm_1.ne)(schema_1.rooms.id, bookedRoomIds[0])));
    }
    async createRoom(room) {
        const [newRoom] = await db_1.db.insert(schema_1.rooms).values(room).returning();
        return newRoom;
    }
    async updateRoom(id, room) {
        const [updatedRoom] = await db_1.db
            .update(schema_1.rooms)
            .set({ ...room, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.rooms.id, id))
            .returning();
        return updatedRoom;
    }
    async deleteRoom(id) {
        await db_1.db.delete(schema_1.rooms).where((0, drizzle_orm_1.eq)(schema_1.rooms.id, id));
    }
    // Guest operations
    async getGuests() {
        return await db_1.db.select().from(schema_1.guests).orderBy((0, drizzle_orm_1.desc)(schema_1.guests.createdAt));
    }
    async getGuest(id) {
        const [guest] = await db_1.db.select().from(schema_1.guests).where((0, drizzle_orm_1.eq)(schema_1.guests.id, id));
        return guest;
    }
    async getGuestByPhone(phone) {
        const [guest] = await db_1.db.select().from(schema_1.guests).where((0, drizzle_orm_1.eq)(schema_1.guests.phone, phone));
        return guest;
    }
    async getGuestByAadhar(aadharNumber) {
        const [guest] = await db_1.db.select().from(schema_1.guests).where((0, drizzle_orm_1.eq)(schema_1.guests.aadharNumber, aadharNumber));
        return guest;
    }
    async createGuest(guest) {
        const [newGuest] = await db_1.db.insert(schema_1.guests).values(guest).returning();
        return newGuest;
    }
    async updateGuest(id, guest) {
        const [updatedGuest] = await db_1.db
            .update(schema_1.guests)
            .set({ ...guest, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.guests.id, id))
            .returning();
        return updatedGuest;
    }
    // Booking operations
    async getBookings() {
        return await db_1.db.select().from(schema_1.bookings).orderBy((0, drizzle_orm_1.desc)(schema_1.bookings.createdAt));
    }
    async getBooking(id) {
        const [booking] = await db_1.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.id, id));
        return booking;
    }
    async getBookingsByGuest(guestId) {
        return await db_1.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.guestId, guestId));
    }
    async getBookingsByRoom(roomId) {
        return await db_1.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.roomId, roomId));
    }
    async getActiveBookings() {
        return await db_1.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.ne)(schema_1.bookings.status, "cancelled"));
    }
    async createBooking(booking) {
        const [newBooking] = await db_1.db.insert(schema_1.bookings).values(booking).returning();
        return newBooking;
    }
    async updateBooking(id, booking) {
        const [updatedBooking] = await db_1.db
            .update(schema_1.bookings)
            .set({ ...booking, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.id, id))
            .returning();
        return updatedBooking;
    }
    // Payment operations
    async getPayments() {
        return await db_1.db.select().from(schema_1.payments).orderBy((0, drizzle_orm_1.desc)(schema_1.payments.createdAt));
    }
    async getPayment(id) {
        const [payment] = await db_1.db.select().from(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
        return payment;
    }
    async getPaymentsByBooking(bookingId) {
        return await db_1.db.select().from(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.bookingId, bookingId));
    }
    async createPayment(payment) {
        const [newPayment] = await db_1.db.insert(schema_1.payments).values(payment).returning();
        return newPayment;
    }
    async updatePayment(id, payment) {
        const [updatedPayment] = await db_1.db
            .update(schema_1.payments)
            .set({ ...payment, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id))
            .returning();
        return updatedPayment;
    }
    // Bill operations
    async getBills() {
        return await db_1.db.select().from(schema_1.bills).orderBy((0, drizzle_orm_1.desc)(schema_1.bills.createdAt));
    }
    async getBill(id) {
        const [bill] = await db_1.db.select().from(schema_1.bills).where((0, drizzle_orm_1.eq)(schema_1.bills.id, id));
        return bill;
    }
    async getBillsByBooking(bookingId) {
        return await db_1.db.select().from(schema_1.bills).where((0, drizzle_orm_1.eq)(schema_1.bills.bookingId, bookingId));
    }
    async createBill(bill) {
        const [newBill] = await db_1.db.insert(schema_1.bills).values(bill).returning();
        return newBill;
    }
    async updateBill(id, bill) {
        const [updatedBill] = await db_1.db
            .update(schema_1.bills)
            .set({ ...bill, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.bills.id, id))
            .returning();
        return updatedBill;
    }
}
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
