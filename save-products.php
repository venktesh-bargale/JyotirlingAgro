<?php
/* =========================================================
   Jyotirling Agro Mart — Product save endpoint
   Called by admin.html to write products.json
   ========================================================= */

// ── Password (must match adminPassword in js/config.js) ──
$ADMIN_PASSWORD = 'agro1234';

// ── CORS: allow only same origin ──
header('Content-Type: application/json');

// ── Read and validate request ──
$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input || !isset($input['password']) || !isset($input['products'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request']);
    exit;
}

if ($input['password'] !== $ADMIN_PASSWORD) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Incorrect password']);
    exit;
}

if (!is_array($input['products'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Products must be an array']);
    exit;
}

// ── Write products.json ──
$file    = __DIR__ . '/js/products.json';
$content = json_encode($input['products'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

if (file_put_contents($file, $content) === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not write file. Check folder permissions.']);
    exit;
}

echo json_encode(['ok' => true, 'saved' => count($input['products'])]);
