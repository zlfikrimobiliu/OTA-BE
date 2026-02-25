const express = require("express");
const adminController = require("./admin.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  createHotelSchema,
  createRoomSchema,
  updateRoomPriceParamsSchema,
  updateRoomPriceSchema,
  listBookingsQuerySchema,
} = require("./admin.validation");

const router = express.Router();

router.post("/hotels", validate(createHotelSchema, "body"), adminController.createHotel);
router.post("/rooms", validate(createRoomSchema, "body"), adminController.createRoom);
router.patch(
  "/rooms/:roomId/price",
  validate(updateRoomPriceParamsSchema, "params"),
  validate(updateRoomPriceSchema, "body"),
  adminController.updateRoomPrice,
);
router.get("/bookings", validate(listBookingsQuerySchema, "query"), adminController.listBookings);

module.exports = router;


