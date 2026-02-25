const express = require("express");
const bookingController = require("./booking.controller");
const validate = require("../../middlewares/validate.middleware");
const { createBookingSchema } = require("./booking.validation");

const router = express.Router();

router.post("/", validate(createBookingSchema, "body"), bookingController.createBooking);

module.exports = router;


