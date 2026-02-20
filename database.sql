CREATE DATABASE IF NOT EXISTS cs2_tracker;
USE cs2_tracker;

DROP TABLE IF EXISTS trades;

CREATE TABLE trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    buy_price DECIMAL(10,2) NOT NULL,
    buy_date DATE NOT NULL,
    buy_platform ENUM('Haloskins', 'CSFloat', 'Skinport', 'Buff163', 'UUPIN', 'Tradeit', 'Steam') NOT NULL,
    currency ENUM('PLN', 'USD') DEFAULT 'PLN' NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    sell_price DECIMAL(10,2) DEFAULT NULL,
    sell_date DATE DEFAULT NULL,
    sell_platform ENUM('Haloskins', 'CSFloat', 'Skinport', 'Buff163', 'UUPIN', 'Tradeit', 'Steam') DEFAULT NULL,
    profit DECIMAL(10,2) DEFAULT NULL,
    status ENUM('UNSOLD', 'SOLD') DEFAULT 'UNSOLD' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;