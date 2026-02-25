const { v4: uuidv4 } = require("uuid");
const bookingRepository = require("./booking.repository");
const { AppError } = require("../../utils/errors");
const { calculateNights } = require("../../utils/date");

async function createBooking(payload) {
  const connection = await bookingRepository.pool.getConnection();

  try {
    await connection.beginTransaction();

    const room = await bookingRepository.getRoomByIdForUpdate(connection, payload.roomId);
    if (!room) {
      throw new AppError("Room not found", 404, []);
    }

    if (room.hotel_id !== payload.hotelId) {
      throw new AppError("Room does not belong to hotel", 400, [
        {
          field: "roomId",
          message: "roomId is invalid for hotelId",
        },
      ]);
    }

    if (payload.guests > room.capacity) {
      throw new AppError("Guests exceed room capacity", 400, [
        {
          field: "guests",
          message: `max allowed guests is ${room.capacity}`,
        },
      ]);
    }

    const overlapCount = await bookingRepository.countOverlappingConfirmedBookingsForUpdate(
      connection,
      payload.roomId,
      payload.checkInDate,
      payload.checkOutDate,
    );

    if (overlapCount >= room.total_rooms) {
      throw new AppError("Room is not available for selected dates", 409, [
        {
          field: "roomId",
          message: "selected room is already fully booked for this date range",
        },
      ]);
    }

    const totalNights = calculateNights(payload.checkInDate, payload.checkOutDate);
    const pricePerNightSnapshot = Number(room.price_per_night);
    const totalPrice = totalNights * pricePerNightSnapshot;
    const bookingReference = uuidv4();

    await bookingRepository.insertBooking(connection, {
      bookingReference,
      hotelId: payload.hotelId,
      roomId: payload.roomId,
      fullName: payload.fullName,
      email: payload.email,
      checkInDate: payload.checkInDate,
      checkOutDate: payload.checkOutDate,
      guests: payload.guests,
      pricePerNightSnapshot,
      totalNights,
      totalPrice,
    });

    await connection.commit();

    return {
      bookingReference,
      totalNights,
      totalPrice,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createBooking,
};


