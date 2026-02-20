🏛️ Features
Elite Trading UI: A premium, dark-themed dashboard inspired by professional trading terminals.

Multi-Market Support: Specialized tracking for Haloskins, CSFloat, Skinport, Buff163, UUPIN, Tradeit, and Steam.

Dual Currency Engine: Seamlessly manage trades in both PLN and USD.

Advanced Analytics: Real-time calculation of net profit, inventory status, and sales volume.

Interactive Performance Chart: Dynamic line charts powered by Chart.js to visualize your equity curve over time.

Responsive Ledger: A clean, organized history of all open and closed positions.

🛠️ Tech Stack
Frontend: HTML5, Modern CSS (Glassmorphism & Flexbox/Grid), JavaScript (ES6).

Backend: PHP 8.x (using PDO for secure, prepared statements).

Database: MySQL/MariaDB.

Visualization: Chart.js.

🚀 Quick Start (XAMPP)
1. Database Setup
Open phpMyAdmin.

Create a new database named cs2_tracker.

Click on the SQL tab and paste the following schema:

SQL
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

2. File Installation
Clone or download this repository.

Move the folder to your XAMPP directory: C:\xampp\htdocs\cs2_tracker.

Ensure your MySQL and Apache modules are running in the XAMPP Control Panel.

3. Usage
Open your browser and navigate to http://localhost/cs2_tracker.

Open Trade: Use the left panel to input your new purchases.

Manage Sale: Click "Manage" on any unsold item to finalize the sale and calculate profit.

📊 Dashboard Preview
The dashboard is split into three strategic areas:

Global Stats: Immediate visibility into your total net profit across both currencies.

Trade Entry & Charts: Log new assets and view your profit trajectory simultaneously.

The Ledger: A complete audit trail of every asset in your portfolio.

🔒 Security
Prepared Statements: Protection against SQL Injection.

Input Sanitization: All HTML output is escaped to prevent XSS.

📝 License
This project is open-source and available under the MIT License.
