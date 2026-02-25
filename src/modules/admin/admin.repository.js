const pool = require("../../config/db");

async function createHotel(payload) {
  const [result] = await pool.execute(
    `
    INSERT INTO hotels (name, city, address, description)
    VALUES (?, ?, ?, ?)
    `,
    [payload.name, payload.city, payload.address, payload.description || null],
  );

  return result.insertId;
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

async function createRoom(payload) {
  const [result] = await pool.execute(
    `
    INSERT INTO rooms (hotel_id, name, capacity, price_per_night, total_rooms)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      payload.hotelId,
      payload.name,
      payload.capacity,
      payload.pricePerNight,
      payload.totalRooms,
    ],
  );

  return result.insertId;
}

async function updateRoomPrice(roomId, pricePerNight) {
  const [result] = await pool.execute(
    `
    UPDATE rooms
    SET price_per_night = ?
    WHERE id = ?
    `,
    [pricePerNight, roomId],
  );

  return result.affectedRows;
}

async function listBookings({ page, limit, hotelId, status }) {
  const safeLimit = Number(limit);
  const safePage = Number(page);
  const offset = (safePage - 1) * safeLimit;
  const filters = [];
  const params = [];

  if (hotelId) {
    filters.push("b.hotel_id = ?");
    params.push(hotelId);
  }

  if (status) {
    filters.push("b.status = ?");
    params.push(status);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.execute(
    `
    SELECT
      b.id,
      b.booking_reference,
      b.hotel_id,
      h.name AS hotel_name,
      b.room_id,
      r.name AS room_name,
      b.full_name,
      b.email,
      b.check_in_date,
      b.check_out_date,
      b.guests,
      b.price_per_night_snapshot,
      b.total_nights,
      b.total_price,
      b.status,
      b.created_at
    FROM bookings b
    INNER JOIN hotels h ON h.id = b.hotel_id
    INNER JOIN rooms r ON r.id = b.room_id
    ${whereClause}
    ORDER BY b.created_at DESC, b.id DESC
    LIMIT ${safeLimit} OFFSET ${offset}
    `,
    params,
  );

  const [countRows] = await pool.execute(
    `
    SELECT COUNT(*) AS total
    FROM bookings b
    ${whereClause}
    `,
    params,
  );

  return {
    items: rows,
    total: countRows[0]?.total || 0,
  };
}

module.exports = {
  createHotel,
  findHotelById,
  createRoom,
  updateRoomPrice,
  listBookings,
};


