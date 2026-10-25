<?php
/**
 * Lead form endpoint for static-export + Apache/PHP shared hosting.
 *
 * Config (never under DocumentRoot):
 *   1) getenv / $_SERVER / $_ENV LEADS_WEBHOOK_URL
 *   2) {account}/teploenergokomplekt/leads.env  (preferred)
 *   3) {account}/teploenergokomplekt/.env       (legacy fallback)
 *
 * Does not log request bodies or webhook URLs.
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 32768) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Некорректный запрос']);
  exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Некорректный JSON']);
  exit;
}

// Server-side honeypot (frontend field company_website must stay empty).
$honeypot = trim((string)($data['company_website'] ?? ''));
if ($honeypot !== '') {
  http_response_code(200);
  echo json_encode(['ok' => true]);
  exit;
}

$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$task = trim((string)($data['task'] ?? ''));

$digits = preg_replace('/\D+/', '', $phone);
if ($digits === null) {
  $digits = '';
}

if (mb_strlen($name) < 2) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Укажите имя']);
  exit;
}
if (strlen($digits) < 10 || strlen($digits) > 15) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Укажите корректный телефон']);
  exit;
}
if (mb_strlen($task) > 2000) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Слишком длинное описание']);
  exit;
}

/**
 * Resolve account data root: .../data from .../data/www/{domain}/api/leads
 */
function leads_account_root(): string {
  return dirname(__DIR__, 4);
}

function leads_read_env_value(string $file, string $key): ?string {
  if (!is_readable($file)) {
    return null;
  }
  $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  if ($lines === false) {
    return null;
  }
  $prefix = $key . '=';
  foreach ($lines as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#') {
      continue;
    }
    if (strpos($line, $prefix) === 0) {
      $value = trim(substr($line, strlen($prefix)));
      $value = trim($value, " \t\"'");
      return $value !== '' ? $value : null;
    }
  }
  return null;
}

function leads_load_webhook_url(): ?string {
  foreach ([getenv('LEADS_WEBHOOK_URL'), $_SERVER['LEADS_WEBHOOK_URL'] ?? null, $_ENV['LEADS_WEBHOOK_URL'] ?? null] as $candidate) {
    if (is_string($candidate) && trim($candidate) !== '') {
      return trim($candidate);
    }
  }

  $root = leads_account_root();
  $preferred = leads_read_env_value($root . '/teploenergokomplekt/leads.env', 'LEADS_WEBHOOK_URL');
  if ($preferred !== null) {
    return $preferred;
  }
  return leads_read_env_value($root . '/teploenergokomplekt/.env', 'LEADS_WEBHOOK_URL');
}

/**
 * Simple filesystem rate limit: max N posts per IP per window.
 * Fail-open if storage is not writable (shared hosting quirks).
 */
function leads_rate_limited(string $ip): bool {
  $dir = leads_account_root() . '/teploenergokomplekt/var';
  if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
  }
  if (!is_dir($dir) || !is_writable($dir)) {
    return false;
  }
  $file = $dir . '/leads-rate.json';
  $now = time();
  $window = 600; // 10 minutes
  $max = 8;
  $fp = @fopen($file, 'c+');
  if ($fp === false) {
    return false;
  }
  if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    return false;
  }
  $rawState = stream_get_contents($fp);
  $state = [];
  if (is_string($rawState) && $rawState !== '') {
    $decoded = json_decode($rawState, true);
    if (is_array($decoded)) {
      $state = $decoded;
    }
  }
  $hits = [];
  if (isset($state[$ip]) && is_array($state[$ip])) {
    foreach ($state[$ip] as $ts) {
      if (is_int($ts) && $ts > $now - $window) {
        $hits[] = $ts;
      }
    }
  }
  $limited = count($hits) >= $max;
  if (!$limited) {
    $hits[] = $now;
  }
  $state[$ip] = $hits;
  // Prune old IPs
  foreach ($state as $key => $list) {
    if (!is_array($list) || $list === []) {
      unset($state[$key]);
    }
  }
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, json_encode($state));
  fflush($fp);
  flock($fp, LOCK_UN);
  fclose($fp);
  return $limited;
}

$webhook = leads_load_webhook_url();
if ($webhook === null) {
  http_response_code(503);
  echo json_encode([
    'ok' => false,
    'code' => 'UNCONFIGURED',
    'error' => 'Приём заявок временно недоступен',
  ]);
  exit;
}

if (!filter_var($webhook, FILTER_VALIDATE_URL) || !preg_match('#^https?://#i', $webhook)) {
  http_response_code(503);
  echo json_encode([
    'ok' => false,
    'code' => 'UNCONFIGURED',
    'error' => 'Приём заявок временно недоступен',
  ]);
  exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (leads_rate_limited($ip)) {
  http_response_code(429);
  echo json_encode(['ok' => false, 'error' => 'Слишком много запросов. Попробуйте позже.']);
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
$setoptOk = curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
  CURLOPT_POSTFIELDS => $payload,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CONNECTTIMEOUT => 5,
  CURLOPT_TIMEOUT => 20,
  CURLOPT_FOLLOWLOCATION => false,
]);
if ($setoptOk !== true) {
  curl_close($ch);
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'Ошибка сети при передаче заявки']);
  exit;
}
$resp = curl_exec($ch);
$code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$errno = curl_errno($ch);
curl_close($ch);

if ($resp === false || $errno !== 0) {
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
