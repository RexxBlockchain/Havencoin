<?php
session_start();

if (!isset($_SESSION['tasks'])) {
    $_SESSION['tasks'] = [
        'telegram' => false,
        'tiktok' => false,
        'discord' => false,
        'twitter' => false
    ];
}

if (!isset($_SESSION['balance'])) {
    $_SESSION['balance'] = 0;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $task = $input['task'];

    if (array_key_exists($task, $_SESSION['tasks']) && !$_SESSION['tasks'][$task]) {
        $_SESSION['tasks'][$task] = true;
        $_SESSION['balance'] += 1000; // Increase balance by 1000 tokens
        echo json_encode(['success' => true, 'balance' => $_SESSION['balance']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or already completed task']);
    }
} else {
    $completedTasks = array_filter($_SESSION['tasks'], fn($completed) => $completed);
    echo json_encode([
        'tasks' => $_SESSION['tasks'],
        'balance' => $_SESSION['balance'],
        'allTasksCompleted' => count($completedTasks) === count($_SESSION['tasks'])
    ]);
}
?>
