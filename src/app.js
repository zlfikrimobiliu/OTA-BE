const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const hotelRoutes = require("./modules/hotels/hotel.routes");
const bookingRoutes = require("./modules/bookings/booking.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "OK",
    data: {
      status: "up",
    },
  });
});

app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;


