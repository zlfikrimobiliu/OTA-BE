const { z } = require("zod");

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

const createBookingSchema = z
  .object({
    hotelId: z.coerce.number().int().positive(),
    roomId: z.coerce.number().int().positive(),
    checkInDate: z.string().regex(isoDateRegex, "checkInDate must be YYYY-MM-DD"),
    checkOutDate: z
      .string()
      .regex(isoDateRegex, "checkOutDate must be YYYY-MM-DD"),
    guests: z.coerce.number().int().min(1, "guests must be at least 1"),
    fullName: z.string().trim().min(3, "fullName must be at least 3 characters"),
    email: z.string().trim().email("email must be valid"),
  })
  .refine((value) => value.checkOutDate > value.checkInDate, {
    path: ["checkOutDate"],
    message: "checkOutDate must be after checkInDate",
  });

module.exports = {
  createBookingSchema,
};

