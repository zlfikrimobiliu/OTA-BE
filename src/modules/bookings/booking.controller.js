const bookingService = require("./booking.service");
const { sendSuccess } = require("../../utils/api-response");

async function createBooking(req, res, next) {
  try {
    const data = await bookingService.createBooking(req.body);
    return sendSuccess(res, {
      status: 201,
      message: "Booking created",
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBooking,
};


