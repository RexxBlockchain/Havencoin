<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';
require 'config.php';

use MongoDB\Client;

header('Content-Type: application/json');

function getBalance($user_id) {
    $uri = 'mongodb+srv://likhonsheikhbd:376lmB9Smh1RdMpD@havencoin.xio29um.mongodb.net/?retryWrites=true&w=majority&appName=Havencoin';
    $client = new Client($uri);

    try {
        $collection = $client->havencoin->user_balances;
        $user = $collection->findOne(['user_id' => (int)$user_id]);

        if ($user) {
            echo json_encode(['success' => true, 'balance' => $user['balance']]);
        } else {
            echo json_encode(['success' => false, 'error' => 'User not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

if (isset($_GET['user_id'])) {
    getBalance($_GET['user_id']);
} else {
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
}
?>
