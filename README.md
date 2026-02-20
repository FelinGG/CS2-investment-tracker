# 🏆 CS2 Arbitrage & Trade Analytics Pro

![CS2 Trading](https://img.shields.io/badge/CS2-Arbitrage_Tracker-C9A341?style=for-the-badge&logo=counter-strike)
![PHP](https://img.shields.io/badge/Backend-PHP_8.x-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

A high-performance, **Elite Trading Dashboard** designed for Counter-Strike 2 skin investors. Track arbitrage opportunities, monitor global profit/loss across diverse markets, and visualize your equity growth with a professional-grade interface.

---

## 💎 Key Features

* **Elite UI/UX**: Modern dark-mode terminal with Glassmorphism effects and gold-accented aesthetics.
* **Global Market Support**: Native tracking for Haloskins, CSFloat, Skinport, Buff163, UUPIN, Tradeit, and Steam.
* **Dual-Currency Engine**: Independent tracking for **PLN** and **USD** positions to manage international arbitrage.
* **Advanced Analytics**:
    * **Net Profit** calculation per currency.
    * **Inventory Status** monitoring (Sold vs. Unsold).
    * **Performance Charting**: Dynamic equity curve powered by **Chart.js**.
* **Portfolio Ledger**: Detailed audit trail of entry prices, quantities, and realized gains.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Modern Grid/Flexbox), JavaScript ES6 |
| **Backend** | PHP 8.x (Secure PDO Architecture) |
| **Database** | MySQL / MariaDB (Relational Schema) |
| **Charts** | Chart.js 4.x |

---

## 🚀 Installation & Setup

### 1. Database Configuration
Run the following SQL schema in your **phpMyAdmin** to initialize the data structure:

```sql
CREATE DATABASE IF NOT EXISTS cs2_tracker;
USE cs2_tracker;

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
    status EN_ENUM('UNSOLD', 'SOLD') DEFAULT 'UNSOLD' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
## 🛠️ Deployment
Clone the repository or download the source files.

Move files to your web root (e.g., C:\xampp\htdocs\cs2_tracker).

Ensure Apache and MySQL are running in your XAMPP Control Panel.

Configure database credentials in db.php.

Launch: http://localhost/cs2_tracker.

## 📈 Dashboard Logic
Asset Intake: Log purchases with platform-specific entry prices and currency selection.

Position Management: Click "Manage" on active positions to finalize sales. The engine automatically calculates profit based on the entry/exit delta.

Visual Intelligence: The performance chart tracks realized profit over time, giving you a clear view of your trading strategy's effectiveness.

## 🛡 Security
SQLi Protection: Fully implemented via PHP Data Objects (PDO) and prepared statements.

XSS Protection: All dynamic outputs are escaped to ensure safe rendering of item names and user data.

## ⚖ License
Distributed under the MIT License.
