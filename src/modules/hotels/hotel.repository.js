const pool = require("../../config/db");

async function findHotelsBySearch({
  city,
  guests,
  checkInDate,
  checkOutDate,
  limit,
  offset,
}) {
  const safeLimit = Number(limit);
  const safeOffset = Number(offset);

  const [rows] = await pool.execute(
    `
    SELECT
      h.id,
      h.name,
      h.city,
      h.address,
      MIN(r.price_per_night) AS lowest_price_per_night
    FROM hotels h
    INNER JOIN rooms r
      ON r.hotel_id = h.id
      AND r.capacity >= ?
    LEFT JOIN (
      SELECT room_id, COUNT(*) AS booked_count
      FROM bookings
      WHERE status = 'CONFIRMED'
        AND check_in_date < ?
        AND check_out_date > ?
      GROUP BY room_id
    ) b ON b.room_id = r.id
    WHERE LOWER(h.city) = LOWER(?)
      AND COALESCE(b.booked_count, 0) < r.total_rooms
    GROUP BY h.id, h.name, h.city, h.address
    ORDER BY h.id DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset}
    `,
    [guests, checkOutDate, checkInDate, city],
  );

  return rows;
}

async function countHotelsBySearch({ city, guests, checkInDate, checkOutDate }) {
  const [rows] = await pool.execute(
    `
    SELECT COUNT(*) AS total
    FROM (
      SELECT h.id
      FROM hotels h
      INNER JOIN rooms r
        ON r.hotel_id = h.id
        AND r.capacity >= ?
      LEFT JOIN (
        SELECT room_id, COUNT(*) AS booked_count
        FROM bookings
        WHERE status = 'CONFIRMED'
          AND check_in_date < ?
          AND check_out_date > ?
        GROUP BY room_id
      ) b ON b.room_id = r.id
      WHERE LOWER(h.city) = LOWER(?)
        AND COALESCE(b.booked_count, 0) < r.total_rooms
      GROUP BY h.id
    ) available_hotels
    `,
    [guests, checkOutDate, checkInDate, city],
  );

  return rows[0]?.total || 0;
}

async function findHotelById(hotelId) {
  const [rows] = await pool.execute(
    `
    SELECT id, name, city, address, description
    FROM hotels
    WHERE id = ?
    LIMIT 1
    `,
    [hotelId],
  );

  return rows[0] || null;
}

async function findAvailableRoomsByHotel({
  hotelId,
  guests,
  checkInDate,
  checkOutDate,
}) {
  const [rows] = await pool.execute(
    `
    SELECT
      r.id,
      r.name,
      r.capacity,
      r.price_per_night,
      r.total_rooms,
      (r.total_rooms - COALESCE(b.booked_count, 0)) AS available_rooms
    FROM rooms r
    LEFT JOIN (
      SELECT room_id, COUNT(*) AS booked_count
      FROM bookings
      WHERE status = 'CONFIRMED'
        AND check_in_date < ?
        AND check_out_date > ?
      GROUP BY room_id
    ) b ON b.room_id = r.id
    WHERE r.hotel_id = ?
      AND r.capacity >= ?
      AND (r.total_rooms - COALESCE(b.booked_count, 0)) > 0
    ORDER BY r.price_per_night ASC, r.id ASC
    `,
    [checkOutDate, checkInDate, hotelId, guests],
  );

  return rows;
}

module.exports = {
  findHotelsBySearch,
  countHotelsBySearch,
  findHotelById,
  findAvailableRoomsByHotel,
};

