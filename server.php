<?php
// Servidor PHP para Gerenciador de Itens
// Compatível com XAMPP

// Configuração CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuração do banco de dados
$config = [
    'host' => 'localhost',
    'dbname' => 'gerenciador_itens',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];

// Classe para gerenciar a conexão com o banco
class Database {
    private $pdo;
    
    public function __construct($config) {
        try {
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
            $this->pdo = new PDO($dsn, $config['username'], $config['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            $this->sendError(500, 'Erro de conexão com o banco de dados: ' . $e->getMessage());
        }
    }
    
    public function getPDO() {
        return $this->pdo;
    }
    
    private function sendError($code, $message) {
        http_response_code($code);
        echo json_encode(['erro' => $message, 'codigo' => $code]);
        exit;
    }
}

// Classe para gerenciar os itens
class ItemManager {
    private $db;
    
    public function __construct($database) {
        $this->db = $database->getPDO();
    }
    
    public function getAll($filtros = []) {
        $sql = "SELECT * FROM itens WHERE ativo = 1";
        $params = [];
        
        if (!empty($filtros['tipo'])) {
            $sql .= " AND tipo LIKE ?";
            $params[] = '%' . $filtros['tipo'] . '%';
        }
        
        if (!empty($filtros['nome'])) {
            $sql .= " AND nome LIKE ?";
            $params[] = '%' . $filtros['nome'] . '%';
        }
        
        $sql .= " ORDER BY data_atualizacao DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM itens WHERE id = ? AND ativo = 1");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function create($data) {
        $sql = "INSERT INTO itens (nome, tipo, quantidade, descricao, preco) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $data['nome'],
            $data['tipo'],
            $data['quantidade'],
            $data['descricao'] ?? '',
            $data['preco'] ?? 0.00
        ]);
    }
    
    public function update($id, $data) {
        $sql = "UPDATE itens SET nome = ?, tipo = ?, quantidade = ?, descricao = ?, preco = ? WHERE id = ? AND ativo = 1";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $data['nome'],
            $data['tipo'],
            $data['quantidade'],
            $data['descricao'] ?? '',
            $data['preco'] ?? 0.00,
            $id
        ]);
    }
    
    public function delete($id) {
        // Soft delete - marca como inativo
        $stmt = $this->db->prepare("UPDATE itens SET ativo = 0 WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function getStats() {
        $stmt = $this->db->query("
            SELECT 
                COUNT(*) as total_itens,
                SUM(quantidade) as total_quantidade,
                SUM(quantidade * preco) as valor_total,
                COUNT(DISTINCT tipo) as tipos_diferentes
            FROM itens WHERE ativo = 1
        ");
        return $stmt->fetch();
    }
}

// Função para enviar resposta JSON
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Função para enviar erro
function sendError($code, $message) {
    http_response_code($code);
    echo json_encode(['erro' => $message, 'codigo' => $code], JSON_UNESCAPED_UNICODE);
    exit;
}

// Inicializar conexão e gerenciador
try {
    $database = new Database($config);
    $itemManager = new ItemManager($database);
} catch (Exception $e) {
    sendError(500, 'Erro interno do servidor');
}

// Roteamento
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';
$id = $_GET['id'] ?? null;

// Obter dados do corpo da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

switch ($endpoint) {
    case 'itens':
        switch ($method) {
            case 'GET':
                if ($id) {
                    $item = $itemManager->getById($id);
                    if ($item) {
                        sendResponse($item);
                    } else {
                        sendError(404, 'Item não encontrado');
                    }
                } else {
                    $filtros = [
                        'tipo' => $_GET['tipo'] ?? '',
                        'nome' => $_GET['nome'] ?? ''
                    ];
                    $itens = $itemManager->getAll($filtros);
                    sendResponse($itens);
                }
                break;
                
            case 'POST':
                if (!$data || !isset($data['nome']) || !isset($data['tipo']) || !isset($data['quantidade'])) {
                    sendError(400, 'Dados obrigatórios não fornecidos');
                }
                
                if ($itemManager->create($data)) {
                    sendResponse(['sucesso' => true, 'mensagem' => 'Item criado com sucesso'], 201);
                } else {
                    sendError(500, 'Erro ao criar item');
                }
                break;
                
            case 'PUT':
                if (!$data || !isset($data['id'])) {
                    sendError(400, 'ID do item não fornecido');
                }
                
                if ($itemManager->update($data['id'], $data)) {
                    sendResponse(['sucesso' => true, 'mensagem' => 'Item atualizado com sucesso']);
                } else {
                    sendError(500, 'Erro ao atualizar item');
                }
                break;
                
            case 'DELETE':
                if (!$data || !isset($data['id'])) {
                    sendError(400, 'ID do item não fornecido');
                }
                
                if ($itemManager->delete($data['id'])) {
                    sendResponse(['sucesso' => true, 'mensagem' => 'Item excluído com sucesso']);
                } else {
                    sendError(500, 'Erro ao excluir item');
                }
                break;
                
            default:
                sendError(405, 'Método não permitido');
        }
        break;
        
    case 'stats':
        if ($method === 'GET') {
            $stats = $itemManager->getStats();
            sendResponse($stats);
        } else {
            sendError(405, 'Método não permitido');
        }
        break;
        
    default:
        sendError(404, 'Endpoint não encontrado');
}
?>

