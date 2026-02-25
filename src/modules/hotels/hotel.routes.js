const express = require("express");
const hotelController = require("./hotel.controller");
const validate = require("../../middlewares/validate.middleware");
const {
  searchHotelsQuerySchema,
  hotelDetailParamsSchema,
  hotelDetailQuerySchema,
} = require("./hotel.validation");

const router = express.Router();

router.get("/search", validate(searchHotelsQuerySchema, "query"), hotelController.searchHotels);
router.get(
  "/:hotelId",
  validate(hotelDetailParamsSchema, "params"),
  validate(hotelDetailQuerySchema, "query"),
  hotelController.getHotelDetail,
);

module.exports = router;

