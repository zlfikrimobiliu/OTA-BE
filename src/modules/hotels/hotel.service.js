const hotelRepository = require("./hotel.repository");
const { AppError } = require("../../utils/errors");
const { calculateNights } = require("../../utils/date");

async function searchHotels(query) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const offset = (page - 1) * limit;

  const [items, total] = await Promise.all([
    hotelRepository.findHotelsBySearch({
      city: query.city,
      guests: query.guests,
      checkInDate: query.checkInDate,
      checkOutDate: query.checkOutDate,
      limit,
      offset,
    }),
    hotelRepository.countHotelsBySearch({
      city: query.city,
      guests: query.guests,
      checkInDate: query.checkInDate,
      checkOutDate: query.checkOutDate,
    }),
  ]);

  return {
    items: items.map((item) => ({
      hotelId: item.id,
      hotelName: item.name,
      city: item.city,
      address: item.address,
      lowestPricePerNight: Number(item.lowest_price_per_night),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  };
}

async function getHotelDetail({ hotelId, checkInDate, checkOutDate, guests }) {
  const hotel = await hotelRepository.findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("Hotel not found", 404, []);
  }

  const totalNights = calculateNights(checkInDate, checkOutDate);
  const availableRooms = await hotelRepository.findAvailableRoomsByHotel({
    hotelId,
    guests,
    checkInDate,
    checkOutDate,
  });

  return {
    hotel: {
      hotelId: hotel.id,
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description,
    },
    rooms: availableRooms.map((room) => {
      const pricePerNight = Number(room.price_per_night);
      return {
        roomId: room.id,
        name: room.name,
        capacity: room.capacity,
        availableRooms: room.available_rooms,
        pricePerNight,
        totalNights,
        totalPrice: totalNights * pricePerNight,
      };
    }),
  };
}

module.exports = {
  searchHotels,
  getHotelDetail,
};

