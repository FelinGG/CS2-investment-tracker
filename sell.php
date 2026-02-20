<?php
require 'db.php';
$id = $_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM trades WHERE id = ?");
$stmt->execute([$id]);
$item = $stmt->fetch();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $profit = $_POST['sell_price'] - $item['buy_price'];
    $update = $pdo->prepare("UPDATE trades SET sell_price = ?, sell_date = ?, sell_platform = ?, profit = ?, status = 'SOLD' WHERE id = ?");
    $update->execute([$_POST['sell_price'], $_POST['sell_date'], $_POST['sell_platform'], $profit, $id]);
    header("Location: index.php"); exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Finalize Sale</title><link rel="stylesheet" href="style.css"></head>
<body>
<div class="container" style="max-width: 500px;">
    <div class="card">
        <h2>Sell Item</h2>
        <p><?= htmlspecialchars($item['item_name']) ?> (Buy: <?= $item['buy_price'] ?> <?= $item['currency'] ?>)</p>
        <form method="POST">
            <input type="number" step="0.01" name="sell_price" value="<?= $item['sell_price'] ?>" placeholder="Sale Price (<?= $item['currency'] ?>)" required>
            <input type="date" name="sell_date" value="<?= $item['sell_date'] ?: date('Y-m-d') ?>" required>
            <select name="sell_platform">
                <?php foreach(['Haloskins','CSFloat','Skinport','Buff163','UUPIN','Tradeit','Steam'] as $p): ?>
                <option value="<?= $p ?>" <?= $item['sell_platform'] == $p ? 'selected' : '' ?>><?= $p ?></option>
                <?php endforeach; ?>
            </select>
            <button type="submit">Complete Sale</button>
            <a href="index.php" style="display:block; text-align:center; color:gray; margin-top:10px;">Back</a>
        </form>
    </div>
</div>
</body></html>
