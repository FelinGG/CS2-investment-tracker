<?php
require 'db.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['add_purchase'])) {
    $stmt = $pdo->prepare("INSERT INTO trades (item_name, buy_platform, buy_date, quantity, currency, buy_price, status) VALUES (?, ?, ?, ?, ?, ?, 'UNSOLD')");
    $stmt->execute([$_POST['item_name'], $_POST['platform'], $_POST['date'], $_POST['quantity'], $_POST['currency'], $_POST['price']]);
    header("Location: index.php"); exit();
}
$profit_pln = $pdo->query("SELECT SUM(profit) FROM trades WHERE status='SOLD' AND currency='PLN'")->fetchColumn() ?: 0;
$profit_usd = $pdo->query("SELECT SUM(profit) FROM trades WHERE status='SOLD' AND currency='USD'")->fetchColumn() ?: 0;
$sold = $pdo->query("SELECT COUNT(*) FROM trades WHERE status='SOLD'")->fetchColumn();
$trades = $pdo->query("SELECT * FROM trades ORDER BY buy_date DESC")->fetchAll();
$chart_data = $pdo->query("SELECT sell_date, profit FROM trades WHERE status='SOLD' ORDER BY sell_date ASC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CS2 Elite Tracker</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<div class="container">
    <div class="stats-row">
        <div class="stat-box">
            <small>Net Profit PLN</small>
            <div class="stat-value" style="color:var(--success)"><?= number_format($profit_pln, 2) ?> zł</div>
        </div>
        <div class="stat-box">
            <small>Net Profit USD</small>
            <div class="stat-value" style="color:var(--success)">$<?= number_format($profit_usd, 2) ?></div>
        </div>
        <div class="stat-box">
            <small>Completed Trades</small>
            <div class="stat-value"><?= $sold ?></div>
        </div>
    </div>

    <div class="dashboard-grid">
        <div class="card">
            <h2>New Position</h2>
            <form method="POST">
                <input type="text" name="item_name" placeholder="Item Name" required>
                <select name="platform">
                    <?php foreach(['Haloskins','CSFloat','Skinport','Buff163','UUPIN','Tradeit','Steam'] as $p) echo "<option value='$p'>$p</option>"; ?>
                </select>
                <select name="currency">
                    <option value="PLN">Currency: PLN</option>
                    <option value="USD">Currency: USD</option>
                </select>
                <input type="number" step="0.01" name="price" placeholder="Price" required>
                <input type="date" name="date" value="<?= date('Y-m-d') ?>">
                <input type="number" name="quantity" value="1" placeholder="Quantity">
                <button type="submit" name="add_purchase">Open Trade</button>
            </form>
        </div>
        <div class="card">
            <h2>Profit Analytics</h2>
            <div class="chart-wrapper"><canvas id="profitChart"></canvas></div>
        </div>
    </div>

    <div class="card">
        <h2>Portfolio Ledger</h2>
        <table>
            <thead>
                <tr><th>Asset</th><th>Platform</th><th>Entry Price</th><th>Qty</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
                <?php foreach ($trades as $trade): $s = ($trade['currency'] == 'PLN' ? ' zł' : ' $'); ?>
                <tr>
                    <td><strong><?= htmlspecialchars($trade['item_name']) ?></strong></td>
                    <td><span style="color:var(--text-muted)"><?= $trade['buy_platform'] ?></span></td>
                    <td><?= $trade['buy_price'] . $s ?></td>
                    <td><?= $trade['quantity'] ?></td>
                    <td><span class="<?= $trade['status'] == 'SOLD' ? 'status-sold' : 'status-unsold' ?>"><?= $trade['status'] ?></span></td>
                    <td><a href="sell.php?id=<?= $trade['id'] ?>" class="btn-edit">Manage</a></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<script>
const ctx = document.getElementById('profitChart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 300);
gradient.addColorStop(0, 'rgba(201, 163, 65, 0.4)');
gradient.addColorStop(1, 'rgba(201, 163, 65, 0)');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: <?= json_encode(array_column($chart_data, 'sell_date')) ?>,
        datasets: [{
            label: 'Profit',
            data: <?= json_encode(array_column($chart_data, 'profit')) ?>,
            borderColor: '#c9a341',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#c9a341',
            pointRadius: 5
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: '#2b3139' }, ticks: { color: '#848e9c' } },
            x: { grid: { display: false }, ticks: { color: '#848e9c' } }
        }
    }
});
</script>
</body></html>
