<?php
header('Content-Type: application/json');
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM trades ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO trades (trade_date, item_name, buy_platform, buy_price, buy_fee, sell_platform, sell_price, fee, net_profit, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['date'], $data['itemName'], $data['buyPlatform'], 
        $data['buyPrice'], $data['buyFee'], $data['sellPlatform'], 
        $data['sellPrice'], $data['fee'], $data['netProfit'], $data['currency']
    ]);
    echo json_encode(['success' => true]);

} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("DELETE FROM trades WHERE id = ?");
    $stmt->execute([$data['id']]);
    echo json_encode(['success' => true]);
}
?>