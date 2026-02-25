const { z } = require("zod");

const createHotelSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  city: z.string().trim().min(1, "city is required"),
  address: z.string().trim().min(1, "address is required"),
  description: z.string().trim().optional().nullable(),
});

const createRoomSchema = z.object({
  hotelId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1, "name is required"),
  capacity: z.coerce.number().int().min(1, "capacity must be at least 1"),
  pricePerNight: z.coerce.number().min(0, "pricePerNight must be at least 0"),
  totalRooms: z.coerce.number().int().min(1, "totalRooms must be at least 1").default(1),
});

const updateRoomPriceParamsSchema = z.object({
  roomId: z.coerce.number().int().positive(),
});

const updateRoomPriceSchema = z.object({
  pricePerNight: z.coerce.number().min(0, "pricePerNight must be at least 0"),
});

const listBookingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  hotelId: z.coerce.number().int().positive().optional(),
  status: z.enum(["CONFIRMED", "CANCELLED"]).optional(),
});

module.exports = {
  createHotelSchema,
  createRoomSchema,
  updateRoomPriceParamsSchema,
  updateRoomPriceSchema,
  listBookingsQuerySchema,
};


