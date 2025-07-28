"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertBillSchema = exports.insertPaymentSchema = exports.insertBookingSchema = exports.insertGuestSchema = exports.insertRoomSchema = exports.insertRoomTypeSchema = exports.insertLodgeSchema = exports.insertAdminSchema = exports.bills = exports.payments = exports.bookings = exports.guests = exports.rooms = exports.roomTypes = exports.lodges = exports.admins = exports.sessions = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
// Session storage table for authentication
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, (table) => [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]);
// Admin users table
exports.admins = (0, pg_core_1.pgTable)("admins", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    username: (0, pg_core_1.varchar)("username", { length: 100 }).unique().notNull(),
    passwordHash: (0, pg_core_1.varchar)("password_hash", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 100 }),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Lodge information table
exports.lodges = (0, pg_core_1.pgTable)("lodges", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    nameTelubu: (0, pg_core_1.varchar)("name_telugu", { length: 255 }),
    address: (0, pg_core_1.text)("address").notNull(),
    addressTelugu: (0, pg_core_1.text)("address_telugu"),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    taxRate: (0, pg_core_1.decimal)("tax_rate", { precision: 5, scale: 2 }).default("0.00"),
    smsTemplate: (0, pg_core_1.text)("sms_template"),
    smsTemplateTelugu: (0, pg_core_1.text)("sms_template_telugu"),
    qrCodeUrl: (0, pg_core_1.text)("qr_code_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Room types and pricing
exports.roomTypes = (0, pg_core_1.pgTable)("room_types", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    lodgeId: (0, pg_core_1.varchar)("lodge_id").references(() => exports.lodges.id).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    nameTelugu: (0, pg_core_1.varchar)("name_telugu", { length: 100 }),
    basePrice: (0, pg_core_1.decimal)("base_price", { precision: 10, scale: 2 }).notNull(),
    maxOccupancy: (0, pg_core_1.integer)("max_occupancy").default(1),
    description: (0, pg_core_1.text)("description"),
    descriptionTelugu: (0, pg_core_1.text)("description_telugu"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Individual rooms
exports.rooms = (0, pg_core_1.pgTable)("rooms", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    lodgeId: (0, pg_core_1.varchar)("lodge_id").references(() => exports.lodges.id).notNull(),
    roomTypeId: (0, pg_core_1.varchar)("room_type_id").references(() => exports.roomTypes.id).notNull(),
    roomNumber: (0, pg_core_1.varchar)("room_number", { length: 20 }).notNull(),
    floor: (0, pg_core_1.integer)("floor"),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("available"), // available, occupied, maintenance, cleaning
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Guest information
exports.guests = (0, pg_core_1.pgTable)("guests", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }).notNull(),
    aadharNumber: (0, pg_core_1.varchar)("aadhar_number", { length: 20 }).unique(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    address: (0, pg_core_1.text)("address"),
    emergencyContactName: (0, pg_core_1.varchar)("emergency_contact_name", { length: 255 }),
    emergencyContactPhone: (0, pg_core_1.varchar)("emergency_contact_phone", { length: 20 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Bookings/Reservations
exports.bookings = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    guestId: (0, pg_core_1.varchar)("guest_id").references(() => exports.guests.id).notNull(),
    roomId: (0, pg_core_1.varchar)("room_id").references(() => exports.rooms.id).notNull(),
    checkInDate: (0, pg_core_1.date)("check_in_date").notNull(),
    checkOutDate: (0, pg_core_1.date)("check_out_date").notNull(),
    actualCheckIn: (0, pg_core_1.timestamp)("actual_check_in"),
    actualCheckOut: (0, pg_core_1.timestamp)("actual_check_out"),
    numberOfGuests: (0, pg_core_1.integer)("number_of_guests").default(1),
    roomPrice: (0, pg_core_1.decimal)("room_price", { precision: 10, scale: 2 }).notNull(),
    taxAmount: (0, pg_core_1.decimal)("tax_amount", { precision: 10, scale: 2 }).default("0.00"),
    totalAmount: (0, pg_core_1.decimal)("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("confirmed"), // confirmed, checked_in, checked_out, cancelled
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Payment records
exports.payments = (0, pg_core_1.pgTable)("payments", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    bookingId: (0, pg_core_1.varchar)("booking_id").references(() => exports.bookings.id).notNull(),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 20 }).notNull(), // cash, qr_code
    paymentStatus: (0, pg_core_1.varchar)("payment_status", { length: 20 }).default("pending"), // pending, completed, failed
    transactionReference: (0, pg_core_1.varchar)("transaction_reference", { length: 255 }),
    paymentDate: (0, pg_core_1.timestamp)("payment_date"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// SMS/Bill records
exports.bills = (0, pg_core_1.pgTable)("bills", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    bookingId: (0, pg_core_1.varchar)("booking_id").references(() => exports.bookings.id).notNull(),
    billNumber: (0, pg_core_1.varchar)("bill_number", { length: 50 }).unique().notNull(),
    billContent: (0, pg_core_1.text)("bill_content").notNull(),
    billContentTelugu: (0, pg_core_1.text)("bill_content_telugu"),
    smsStatus: (0, pg_core_1.varchar)("sms_status", { length: 20 }).default("pending"), // pending, sent, delivered, failed
    sentAt: (0, pg_core_1.timestamp)("sent_at"),
    recipientPhone: (0, pg_core_1.varchar)("recipient_phone", { length: 20 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Zod schemas for validation
exports.insertAdminSchema = (0, drizzle_zod_1.createInsertSchema)(exports.admins, {
    passwordHash: zod_1.z.string().min(6),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertLodgeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.lodges).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertRoomTypeSchema = (0, drizzle_zod_1.createInsertSchema)(exports.roomTypes).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertRoomSchema = (0, drizzle_zod_1.createInsertSchema)(exports.rooms).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertGuestSchema = (0, drizzle_zod_1.createInsertSchema)(exports.guests, {
    phone: zod_1.z.string().min(10),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertBookingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.bookings).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertPaymentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.payments).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertBillSchema = (0, drizzle_zod_1.createInsertSchema)(exports.bills).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
