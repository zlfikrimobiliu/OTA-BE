CREATE DATABASE IF NOT EXISTS ota_booking
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ota_booking;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS hotels;

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

-- Seed data
INSERT INTO hotels (id, name, city, address, description) VALUES
  (1, 'HOTEL-BALI', 'BALI', 'jl.testinggg', 'testinggg'),
  (2, 'HOTEL JAKARTA', 'JAKARTA', 'jl.jakajaskajk', 'TESTINGG');

INSERT INTO rooms (id, hotel_id, name, capacity, price_per_night, total_rooms) VALUES
  (1, 1, 'VIP', 4, 4500000.00, 1),
  (2, 2, 'VIP', 6, 7500000.00, 1);

INSERT INTO bookings (
  id,
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
) VALUES
  (1, '51d09c4e-618f-428b-8020-4604f2154c7c', 1, 1, 'fikri', 'fikrimobiliu@gmail.com', '2026-02-25', '2026-02-26', 2, 4500000.00, 1, 4500000.00, 'CONFIRMED'),
  (2, '14859fc2-d955-4ff7-a5dc-137f4ff5ca28', 2, 2, 'Fikri2', 'Testing@testing.com', '2026-02-25', '2026-02-26', 1, 7500000.00, 1, 7500000.00, 'CONFIRMED');
