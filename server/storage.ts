import {
  admins,
  lodges,
  roomTypes,
  rooms,
  guests,
  bookings,
  payments,
  bills,
  type Admin,
  type UpsertAdmin,
  type Lodge,
  type UpsertLodge,
  type RoomType,
  type UpsertRoomType,
  type Room,
  type UpsertRoom,
  type Guest,
  type UpsertGuest,
  type Booking,
  type UpsertBooking,
  type Payment,
  type UpsertPayment,
  type Bill,
  type UpsertBill,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte, ne } from "drizzle-orm";

export interface IStorage {
  // Admin operations
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: UpsertAdmin): Promise<Admin>;
  updateAdmin(id: string, admin: Partial<UpsertAdmin>): Promise<Admin>;

  // Lodge operations
  getLodge(id: string): Promise<Lodge | undefined>;
  getFirstLodge(): Promise<Lodge | undefined>;
  createLodge(lodge: UpsertLodge): Promise<Lodge>;
  updateLodge(id: string, lodge: Partial<UpsertLodge>): Promise<Lodge>;

  // Room Type operations
  getRoomTypes(lodgeId: string): Promise<RoomType[]>;
  getRoomType(id: string): Promise<RoomType | undefined>;
  createRoomType(roomType: UpsertRoomType): Promise<RoomType>;
  updateRoomType(id: string, roomType: Partial<UpsertRoomType>): Promise<RoomType>;
  deleteRoomType(id: string): Promise<void>;

  // Room operations
  getRooms(lodgeId: string): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  getRoomsByType(roomTypeId: string): Promise<Room[]>;
  getAvailableRooms(lodgeId: string, checkInDate: string, checkOutDate: string): Promise<Room[]>;
  createRoom(room: UpsertRoom): Promise<Room>;
  updateRoom(id: string, room: Partial<UpsertRoom>): Promise<Room>;
  deleteRoom(id: string): Promise<void>;

  // Guest operations
  getGuests(): Promise<Guest[]>;
  getGuest(id: string): Promise<Guest | undefined>;
  getGuestByPhone(phone: string): Promise<Guest | undefined>;
  getGuestByAadhar(aadharNumber: string): Promise<Guest | undefined>;
  createGuest(guest: UpsertGuest): Promise<Guest>;
  updateGuest(id: string, guest: Partial<UpsertGuest>): Promise<Guest>;

  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByGuest(guestId: string): Promise<Booking[]>;
  getBookingsByRoom(roomId: string): Promise<Booking[]>;
  getActiveBookings(): Promise<Booking[]>;
  createBooking(booking: UpsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<UpsertBooking>): Promise<Booking>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByBooking(bookingId: string): Promise<Payment[]>;
  createPayment(payment: UpsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<UpsertPayment>): Promise<Payment>;

  // Bill operations
  getBills(): Promise<Bill[]>;
  getBill(id: string): Promise<Bill | undefined>;
  getBillsByBooking(bookingId: string): Promise<Bill[]>;
  createBill(bill: UpsertBill): Promise<Bill>;
  updateBill(id: string, bill: Partial<UpsertBill>): Promise<Bill>;
}

export class DatabaseStorage implements IStorage {
  // Admin operations
  async getAdmin(id: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }

  async createAdmin(admin: UpsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }

  async updateAdmin(id: string, admin: Partial<UpsertAdmin>): Promise<Admin> {
    const [updatedAdmin] = await db
      .update(admins)
      .set({ ...admin, updatedAt: new Date() })
      .where(eq(admins.id, id))
      .returning();
    return updatedAdmin;
  }

  // Lodge operations
  async getLodge(id: string): Promise<Lodge | undefined> {
    const [lodge] = await db.select().from(lodges).where(eq(lodges.id, id));
    return lodge;
  }

  async getFirstLodge(): Promise<Lodge | undefined> {
    const [lodge] = await db.select().from(lodges).limit(1);
    return lodge;
  }

  async createLodge(lodge: UpsertLodge): Promise<Lodge> {
    const [newLodge] = await db.insert(lodges).values(lodge).returning();
    return newLodge;
  }

  async updateLodge(id: string, lodge: Partial<UpsertLodge>): Promise<Lodge> {
    const [updatedLodge] = await db
      .update(lodges)
      .set({ ...lodge, updatedAt: new Date() })
      .where(eq(lodges.id, id))
      .returning();
    return updatedLodge;
  }

  // Room Type operations
  async getRoomTypes(lodgeId: string): Promise<RoomType[]> {
    return await db.select().from(roomTypes).where(eq(roomTypes.lodgeId, lodgeId));
  }

  async getRoomType(id: string): Promise<RoomType | undefined> {
    const [roomType] = await db.select().from(roomTypes).where(eq(roomTypes.id, id));
    return roomType;
  }

  async createRoomType(roomType: UpsertRoomType): Promise<RoomType> {
    const [newRoomType] = await db.insert(roomTypes).values(roomType).returning();
    return newRoomType;
  }

  async updateRoomType(id: string, roomType: Partial<UpsertRoomType>): Promise<RoomType> {
    const [updatedRoomType] = await db
      .update(roomTypes)
      .set({ ...roomType, updatedAt: new Date() })
      .where(eq(roomTypes.id, id))
      .returning();
    return updatedRoomType;
  }

  async deleteRoomType(id: string): Promise<void> {
    await db.delete(roomTypes).where(eq(roomTypes.id, id));
  }

  // Room operations
  async getRooms(lodgeId: string): Promise<Room[]> {
    return await db.select().from(rooms).where(eq(rooms.lodgeId, lodgeId));
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async getRoomsByType(roomTypeId: string): Promise<Room[]> {
    return await db.select().from(rooms).where(eq(rooms.roomTypeId, roomTypeId));
  }

  async getAvailableRooms(lodgeId: string, checkInDate: string, checkOutDate: string): Promise<Room[]> {
    // Get rooms that are not booked during the specified period
    const bookedRooms = await db
      .select({ roomId: bookings.roomId })
      .from(bookings)
      .where(
        and(
          ne(bookings.status, "cancelled"),
          gte(bookings.checkOutDate, checkInDate),
          lte(bookings.checkInDate, checkOutDate)
        )
      );

    const bookedRoomIds = bookedRooms.map(b => b.roomId);

    if (bookedRoomIds.length === 0) {
      return await db.select().from(rooms).where(
        and(
          eq(rooms.lodgeId, lodgeId),
          eq(rooms.status, "available"),
          eq(rooms.isActive, true)
        )
      );
    }

    return await db.select().from(rooms).where(
      and(
        eq(rooms.lodgeId, lodgeId),
        eq(rooms.status, "available"),
        eq(rooms.isActive, true),
        // @ts-ignore - Drizzle typing issue with notIn
        ne(rooms.id, bookedRoomIds[0])
      )
    );
  }

  async createRoom(room: UpsertRoom): Promise<Room> {
    const [newRoom] = await db.insert(rooms).values(room).returning();
    return newRoom;
  }

  async updateRoom(id: string, room: Partial<UpsertRoom>): Promise<Room> {
    const [updatedRoom] = await db
      .update(rooms)
      .set({ ...room, updatedAt: new Date() })
      .where(eq(rooms.id, id))
      .returning();
    return updatedRoom;
  }

  async deleteRoom(id: string): Promise<void> {
    await db.delete(rooms).where(eq(rooms.id, id));
  }

  // Guest operations
  async getGuests(): Promise<Guest[]> {
    return await db.select().from(guests).orderBy(desc(guests.createdAt));
  }

  async getGuest(id: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.id, id));
    return guest;
  }

  async getGuestByPhone(phone: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.phone, phone));
    return guest;
  }

  async getGuestByAadhar(aadharNumber: string): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.aadharNumber, aadharNumber));
    return guest;
  }

  async createGuest(guest: UpsertGuest): Promise<Guest> {
    const [newGuest] = await db.insert(guests).values(guest).returning();
    return newGuest;
  }

  async updateGuest(id: string, guest: Partial<UpsertGuest>): Promise<Guest> {
    const [updatedGuest] = await db
      .update(guests)
      .set({ ...guest, updatedAt: new Date() })
      .where(eq(guests.id, id))
      .returning();
    return updatedGuest;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByGuest(guestId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.guestId, guestId));
  }

  async getBookingsByRoom(roomId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.roomId, roomId));
  }

  async getActiveBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).where(ne(bookings.status, "cancelled"));
  }

  async createBooking(booking: UpsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: string, booking: Partial<UpsertBooking>): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ ...booking, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.bookingId, bookingId));
  }

  async createPayment(payment: UpsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: string, payment: Partial<UpsertPayment>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Bill operations
  async getBills(): Promise<Bill[]> {
    return await db.select().from(bills).orderBy(desc(bills.createdAt));
  }

  async getBill(id: string): Promise<Bill | undefined> {
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill;
  }

  async getBillsByBooking(bookingId: string): Promise<Bill[]> {
    return await db.select().from(bills).where(eq(bills.bookingId, bookingId));
  }

  async createBill(bill: UpsertBill): Promise<Bill> {
    const [newBill] = await db.insert(bills).values(bill).returning();
    return newBill;
  }

  async updateBill(id: string, bill: Partial<UpsertBill>): Promise<Bill> {
    const [updatedBill] = await db
      .update(bills)
      .set({ ...bill, updatedAt: new Date() })
      .where(eq(bills.id, id))
      .returning();
    return updatedBill;
  }
}

export const storage = new DatabaseStorage();