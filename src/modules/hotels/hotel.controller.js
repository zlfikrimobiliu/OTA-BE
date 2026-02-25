const hotelService = require("./hotel.service");
const { sendSuccess } = require("../../utils/api-response");

async function searchHotels(req, res, next) {
  try {
    const data = await hotelService.searchHotels(req.query);
    return sendSuccess(res, { data });
  } catch (error) {
    return next(error);
  }
}

async function getHotelDetail(req, res, next) {
  try {
    const data = await hotelService.getHotelDetail({
      hotelId: req.params.hotelId,
      ...req.query,
    });

    return sendSuccess(res, { data });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  searchHotels,
  getHotelDetail,
};

