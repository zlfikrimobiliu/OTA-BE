const adminRepository = require("./admin.repository");
const { AppError } = require("../../utils/errors");

async function createHotel(payload) {
  const hotelId = await adminRepository.createHotel(payload);

  return {
    hotelId,
  };
}

async function createRoom(payload) {
  const hotel = await adminRepository.findHotelById(payload.hotelId);

  if (!hotel) {
    throw new AppError("Hotel not found", 404, []);
  }

  const roomId = await adminRepository.createRoom(payload);

  return {
    roomId,
    hotelId: payload.hotelId,
  };
}

async function updateRoomPrice(roomId, pricePerNight) {
  const affectedRows = await adminRepository.updateRoomPrice(roomId, pricePerNight);

  if (affectedRows === 0) {
    throw new AppError("Room not found", 404, []);
  }

  return {
    roomId,
    pricePerNight,
  };
}

async function listBookings(query) {
  const page = query.page || 1;
  const limit = query.limit || 10;

  const result = await adminRepository.listBookings({
    page,
    limit,
    hotelId: query.hotelId,
    status: query.status,
  });

  return {
    items: result.items.map((item) => ({
      id: item.id,
      bookingReference: item.booking_reference,
      hotelId: item.hotel_id,
      hotelName: item.hotel_name,
      roomId: item.room_id,
      roomName: item.room_name,
      fullName: item.full_name,
      email: item.email,
      checkInDate: item.check_in_date,
      checkOutDate: item.check_out_date,
      guests: item.guests,
      pricePerNightSnapshot: Number(item.price_per_night_snapshot),
      totalNights: item.total_nights,
      totalPrice: Number(item.total_price),
      status: item.status,
      createdAt: item.created_at,
    })),
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: result.total === 0 ? 0 : Math.ceil(result.total / limit),
    },
  };
}

module.exports = {
  createHotel,
  createRoom,
  updateRoomPrice,
  listBookings,
};


