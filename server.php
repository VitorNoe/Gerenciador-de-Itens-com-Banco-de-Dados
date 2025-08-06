<?php
// Configuração do banco
$host = 'localhost';
$db = 'cursojs';
$user = 'root';
$pass = '';

header('Content-Type: application/json');
try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['erro' => 'Falha na conexão']);
  exit;
}

$endpoint = $_GET['endpoint'] ?? '';
if ($endpoint === 'itens') {
  $method = $_SERVER['REQUEST_METHOD'];
  if ($method === 'GET') {
    if (isset($_GET['id'])) {
      $stmt = $pdo->prepare('SELECT * FROM itens WHERE id = ?');
      $stmt->execute([$_GET['id']]);
      $res = $stmt->fetch(PDO::FETCH_ASSOC);
      echo json_encode($res ?: []);
    } else {
      $res = $pdo->query('SELECT * FROM itens')->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($res);
    }
    exit;
  }
  $data = json_decode(file_get_contents('php://input'), true);
  if ($method === 'POST') {
    $stmt = $pdo->prepare('INSERT INTO itens (nome, tipo, quantidade) VALUES (?, ?, ?)');
    $stmt->execute([$data['nome'], $data['tipo'], $data['quantidade']]);
    echo json_encode(['ok' => true]);
    exit;
  }
  if ($method === 'PUT') {
    $stmt = $pdo->prepare('UPDATE itens SET nome=?, tipo=?, quantidade=? WHERE id=?');
    $stmt->execute([$data['nome'], $data['tipo'], $data['quantidade'], $data['id']]);
    echo json_encode(['ok' => true]);
    exit;
  }
  if ($method === 'DELETE') {
    $stmt = $pdo->prepare('DELETE FROM itens WHERE id=?');
    $stmt->execute([$data['id']]);
    echo json_encode(['ok' => true]);
    exit;
  }
}
echo json_encode(['erro' => 'Endpoint inválido']);
