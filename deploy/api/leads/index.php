<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Некорректный JSON']);
  exit;
}

$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$task = trim((string)($data['task'] ?? ''));

$digits = preg_replace('/\D+/', '', $phone);
if (mb_strlen($name) < 2) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Укажите имя']);
  exit;
}
if ($digits === null || strlen($digits) < 10 || strlen($digits) > 15) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Укажите корректный телефон']);
  exit;
}
if (mb_strlen($task) > 2000) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Слишком длинное описание']);
  exit;
}

$webhook = getenv('LEADS_WEBHOOK_URL');
if (!$webhook) {
  // .../www/jeesuscrised.ru/api/leads -> .../data/teploenergokomplekt/.env
  $envFile = dirname(__DIR__, 4) . '/teploenergokomplekt/.env';
  if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
      if ($line === '' || $line[0] === '#') continue;
      if (strpos($line, 'LEADS_WEBHOOK_URL=') === 0) {
        $webhook = trim(substr($line, strlen('LEADS_WEBHOOK_URL=')), " \t\"'");
        break;
      }
    }
  }
}

if (!$webhook) {
  http_response_code(503);
  echo json_encode([
    'ok' => false,
    'code' => 'UNCONFIGURED',
    'error' => 'LEADS_WEBHOOK_URL is not configured',
  ]);
  exit;
}

$payload = json_encode([
  'source' => 'teploenergokomplekt-website',
  'name' => $name,
  'phone' => $phone,
  'task' => $task,
  'submittedAt' => gmdate('c'),
], JSON_UNESCAPED_UNICODE);

$ch = curl_init($webhook);
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
  CURLOPT_POSTFIELDS => $payload,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 20,
]);
$resp = curl_exec($ch);
$code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($resp === false) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'Ошибка сети при передаче заявки']);
  exit;
}
if ($code < 200 || $code >= 300) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'Ошибка при передаче заявки']);
  exit;
}

echo json_encode(['ok' => true]);
