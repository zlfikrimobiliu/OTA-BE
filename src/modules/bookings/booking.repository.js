const pool = require("../../config/db");

async function getRoomByIdForUpdate(connection, roomId) {
  const [rows] = await connection.execute(
    `
    SELECT id, hotel_id, capacity, price_per_night, total_rooms
    FROM rooms
    WHERE id = ?
    FOR UPDATE
    `,
    [roomId],
  );

  return rows[0] || null;
}

async function countOverlappingConfirmedBookingsForUpdate(
  connection,
  roomId,
  checkInDate,
  checkOutDate,
) {
  const [rows] = await connection.execute(
    `
    SELECT COUNT(*) AS overlap_count
    FROM bookings
    WHERE room_id = ?
      AND status = 'CONFIRMED'
      AND check_in_date < ?
      AND check_out_date > ?
    FOR UPDATE
    `,
    [roomId, checkOutDate, checkInDate],
  );

  return rows[0]?.overlap_count || 0;
}

async function insertBooking(connection, payload) {
  const [result] = await connection.execute(
    `
    INSERT INTO bookings (
      booking_reference,
      hotel_id,
      room_id,
      full_name,
      email,
      check_in_date,
      check_out_date,
      guests,
      price_per_night_snapshot,
      total_nights,
      total_price,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `,
    [
      payload.bookingReference,
      payload.hotelId,
      payload.roomId,
      payload.fullName,
      payload.email,
      payload.checkInDate,
      payload.checkOutDate,
      payload.guests,
      payload.pricePerNightSnapshot,
      payload.totalNights,
      payload.totalPrice,
    ],
  );

  return result.insertId;
}

module.exports = {
  pool,
  getRoomByIdForUpdate,
  countOverlappingConfirmedBookingsForUpdate,
  insertBooking,
};


