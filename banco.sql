-- Banco de dados para o Gerenciador de Itens
-- Compatível com XAMPP/MySQL

CREATE DATABASE IF NOT EXISTS gerenciador_itens;
USE gerenciador_itens;

-- Tabela de itens com campos adicionais
CREATE TABLE IF NOT EXISTS itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  quantidade INT NOT NULL DEFAULT 0,
  descricao TEXT,
  preco DECIMAL(10,2) DEFAULT 0.00,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,
  INDEX idx_nome (nome),
  INDEX idx_tipo (tipo),
  INDEX idx_ativo (ativo)
);

-- Inserir alguns dados de exemplo
INSERT INTO itens (nome, tipo, quantidade, descricao, preco) VALUES
('Notebook Dell', 'Eletrônicos', 5, 'Notebook Dell Inspiron 15 3000', 2500.00),
('Mouse Logitech', 'Periféricos', 20, 'Mouse óptico sem fio', 89.90),
('Teclado Mecânico', 'Periféricos', 8, 'Teclado mecânico RGB', 299.99),
('Monitor 24"', 'Eletrônicos', 3, 'Monitor LED Full HD 24 polegadas', 899.00),
('Cabo HDMI', 'Acessórios', 15, 'Cabo HDMI 2.0 - 2 metros', 25.50);

