CREATE TABLE hotels (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_hotels_city (city)
) ENGINE=InnoDB;

CREATE TABLE rooms (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hotel_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  capacity INT UNSIGNED NOT NULL,
  price_per_night DECIMAL(12,2) NOT NULL,
  total_rooms INT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT chk_rooms_capacity CHECK (capacity > 0),
  CONSTRAINT chk_rooms_price CHECK (price_per_night >= 0),
  CONSTRAINT chk_rooms_total CHECK (total_rooms > 0),
  INDEX idx_rooms_hotel_id (hotel_id),
  INDEX idx_rooms_capacity (capacity)
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_reference CHAR(36) NOT NULL UNIQUE,
  hotel_id BIGINT UNSIGNED NOT NULL,
  room_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INT UNSIGNED NOT NULL,
  price_per_night_snapshot DECIMAL(12,2) NOT NULL,
  total_nights INT UNSIGNED NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  status ENUM('CONFIRMED','CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE RESTRICT,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
  CONSTRAINT chk_booking_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT chk_booking_guests CHECK (guests > 0),
  INDEX idx_bookings_room_dates_status (room_id, check_in_date, check_out_date, status),
  INDEX idx_bookings_hotel_id (hotel_id),
  INDEX idx_bookings_email (email)
) ENGINE=InnoDB;


