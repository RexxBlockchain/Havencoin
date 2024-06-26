<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';
require 'config.php';

use MongoDB\Client;

header('Content-Type: application/json');

function updateBalance($user_id, $balance) {
    $uri = 'mongodb+srv://likhonsheikhbd:376lmB9Smh1RdMpD@havencoin.xio29um.mongodb.net/?retryWrites=true&w=majority&appName=Havencoin';
    $client = new Client($uri);

    try {
        $collection = $client->havencoin->user_balances;
        $result = $collection->updateOne(
            ['user_id' => (int)$user_id],
            ['$set' => ['balance' => (int)$balance]],
            ['upsert' => true]
        );

        if ($result->getModifiedCount() > 0 || $result->getUpsertedCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to update balance']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['user_id']) && isset($data['balance'])) {
    updateBalance($data['user_id'], $data['balance']);
} else {
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
}
?>
