const { z } = require("zod");

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

const searchHotelsQuerySchema = z
  .object({
    city: z.string().trim().min(1, "city is required"),
    checkInDate: z.string().regex(isoDateRegex, "checkInDate must be YYYY-MM-DD"),
    checkOutDate: z
      .string()
      .regex(isoDateRegex, "checkOutDate must be YYYY-MM-DD"),
    guests: z.coerce.number().int().min(1, "guests must be at least 1"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .refine((value) => value.checkOutDate > value.checkInDate, {
    path: ["checkOutDate"],
    message: "checkOutDate must be after checkInDate",
  });

const hotelDetailParamsSchema = z.object({
  hotelId: z.coerce.number().int().positive(),
});

const hotelDetailQuerySchema = z
  .object({
    checkInDate: z.string().regex(isoDateRegex, "checkInDate must be YYYY-MM-DD"),
    checkOutDate: z
      .string()
      .regex(isoDateRegex, "checkOutDate must be YYYY-MM-DD"),
    guests: z.coerce.number().int().min(1, "guests must be at least 1"),
  })
  .refine((value) => value.checkOutDate > value.checkInDate, {
    path: ["checkOutDate"],
    message: "checkOutDate must be after checkInDate",
  });

module.exports = {
  searchHotelsQuerySchema,
  hotelDetailParamsSchema,
  hotelDetailQuerySchema,
};

