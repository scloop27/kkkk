var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, timestamp, varchar, text, integer, decimal, boolean, date, } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// Session storage table for authentication
export var sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
}, function (table) { return [index("IDX_session_expire").on(table.expire)]; });
// Admin users table
export var admins = pgTable("admins", {
    id: varchar("id").primaryKey().default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    username: varchar("username", { length: 100 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Lodge information table
export var lodges = pgTable("lodges", {
    id: varchar("id").primaryKey().default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    name: varchar("name", { length: 255 }).notNull(),
    nameTelubu: varchar("name_telugu", { length: 255 }),
    address: text("address").notNull(),
    addressTelugu: text("address_telugu"),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0.00"),
    smsTemplate: text("sms_template"),
    smsTemplateTelugu: text("sms_template_telugu"),
    qrCodeUrl: text("qr_code_url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Room types and pricing
export var roomTypes = pgTable("room_types", {
    id: varchar("id").primaryKey().default(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    lodgeId: varchar("lodge_id").references(function () { return lodges.id; }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    nameTelugu: varchar("name_telugu", { length: 100 }),
    basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
    maxOccupancy: integer("max_occupancy").default(1),
    description: text("description"),
    descriptionTelugu: text("description_telugu"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Individual rooms
export var rooms = pgTable("rooms", {
    id: varchar("id").primaryKey().default(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    lodgeId: varchar("lodge_id").references(function () { return lodges.id; }).notNull(),
    roomTypeId: varchar("room_type_id").references(function () { return roomTypes.id; }).notNull(),
    roomNumber: varchar("room_number", { length: 20 }).notNull(),
    floor: integer("floor"),
    status: varchar("status", { length: 20 }).default("available"), // available, occupied, maintenance, cleaning
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Guest information
export var guests = pgTable("guests", {
    id: varchar("id").primaryKey().default(sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    aadharNumber: varchar("aadhar_number", { length: 20 }).unique(),
    email: varchar("email", { length: 255 }),
    address: text("address"),
    emergencyContactName: varchar("emergency_contact_name", { length: 255 }),
    emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Bookings/Reservations
export var bookings = pgTable("bookings", {
    id: varchar("id").primaryKey().default(sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    guestId: varchar("guest_id").references(function () { return guests.id; }).notNull(),
    roomId: varchar("room_id").references(function () { return rooms.id; }).notNull(),
    checkInDate: date("check_in_date").notNull(),
    checkOutDate: date("check_out_date").notNull(),
    actualCheckIn: timestamp("actual_check_in"),
    actualCheckOut: timestamp("actual_check_out"),
    numberOfGuests: integer("number_of_guests").default(1),
    roomPrice: decimal("room_price", { precision: 10, scale: 2 }).notNull(),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0.00"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("confirmed"), // confirmed, checked_in, checked_out, cancelled
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Payment records
export var payments = pgTable("payments", {
    id: varchar("id").primaryKey().default(sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    bookingId: varchar("booking_id").references(function () { return bookings.id; }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 20 }).notNull(), // cash, qr_code
    paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // pending, completed, failed
    transactionReference: varchar("transaction_reference", { length: 255 }),
    paymentDate: timestamp("payment_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// SMS/Bill records
export var bills = pgTable("bills", {
    id: varchar("id").primaryKey().default(sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    bookingId: varchar("booking_id").references(function () { return bookings.id; }).notNull(),
    billNumber: varchar("bill_number", { length: 50 }).unique().notNull(),
    billContent: text("bill_content").notNull(),
    billContentTelugu: text("bill_content_telugu"),
    smsStatus: varchar("sms_status", { length: 20 }).default("pending"), // pending, sent, delivered, failed
    sentAt: timestamp("sent_at"),
    recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Zod schemas for validation
export var insertAdminSchema = createInsertSchema(admins, {
    passwordHash: z.string().min(6),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertLodgeSchema = createInsertSchema(lodges).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertRoomTypeSchema = createInsertSchema(roomTypes).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertRoomSchema = createInsertSchema(rooms).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertGuestSchema = createInsertSchema(guests, {
    phone: z.string().min(10),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertBookingSchema = createInsertSchema(bookings).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertPaymentSchema = createInsertSchema(payments).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertBillSchema = createInsertSchema(bills).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
