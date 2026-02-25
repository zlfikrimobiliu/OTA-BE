const adminService = require("./admin.service");
const { sendSuccess } = require("../../utils/api-response");

async function createHotel(req, res, next) {
  try {
    const data = await adminService.createHotel(req.body);
    return sendSuccess(res, {
      status: 201,
      message: "Hotel created",
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function createRoom(req, res, next) {
  try {
    const data = await adminService.createRoom(req.body);
    return sendSuccess(res, {
      status: 201,
      message: "Room created",
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateRoomPrice(req, res, next) {
  try {
    const data = await adminService.updateRoomPrice(
      req.params.roomId,
      req.body.pricePerNight,
    );

    return sendSuccess(res, {
      status: 200,
      message: "Room price updated",
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function listBookings(req, res, next) {
  try {
    const data = await adminService.listBookings(req.query);
    return sendSuccess(res, {
      status: 200,
      message: "OK",
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createHotel,
  createRoom,
  updateRoomPrice,
  listBookings,
};


