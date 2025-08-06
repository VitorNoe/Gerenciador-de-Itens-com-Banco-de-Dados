# 🚀 Guia de Instalação - Gerenciador de Itens

Este guia fornece instruções detalhadas para instalar e configurar o Gerenciador de Itens em diferentes ambientes.

## 📋 Pré-requisitos

### Software Necessário
- **XAMPP** (recomendado) ou servidor web com:
  - PHP 8.1 ou superior
  - MySQL 5.7 ou superior
  - Apache (opcional, pode usar servidor built-in do PHP)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### Conhecimentos Básicos
- Conceitos básicos de servidor web
- Uso do phpMyAdmin ou linha de comando MySQL
- Navegação em diretórios

## 🔧 Instalação com XAMPP (Recomendado)

### Passo 1: Baixar e Instalar XAMPP
1. Acesse [https://www.apachefriends.org](https://www.apachefriends.org)
2. Baixe a versão mais recente para seu sistema operacional
3. Execute o instalador e siga as instruções
4. Certifique-se de instalar Apache, MySQL e PHP

### Passo 2: Configurar os Arquivos
1. Localize a pasta `htdocs` do XAMPP:
   - **Windows**: `C:\xampp\htdocs\`
   - **macOS**: `/Applications/XAMPP/htdocs/`
   - **Linux**: `/opt/lampp/htdocs/`

2. Crie uma pasta chamada `gerenciador_itens`:
   ```
   htdocs/
   └── gerenciador_itens/
   ```

3. Copie todos os arquivos do projeto para esta pasta:
   ```
   htdocs/gerenciador_itens/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── server.php
   ├── banco.sql
   ├── README.md
   └── INSTALACAO.md
   ```

### Passo 3: Iniciar os Serviços
1. Abra o XAMPP Control Panel
2. Inicie os serviços:
   - **Apache**: Clique em "Start"
   - **MySQL**: Clique em "Start"
3. Verifique se ambos estão com status "Running" (verde)

### Passo 4: Configurar o Banco de Dados
1. Abra o navegador e acesse: `http://localhost/phpmyadmin`
2. Clique em "Novo" para criar um novo banco de dados
3. Digite o nome: `gerenciador_itens`
4. Clique em "Criar"
5. Selecione o banco criado
6. Clique na aba "SQL"
7. Copie e cole o conteúdo do arquivo `banco.sql`
8. Clique em "Executar"

### Passo 5: Testar a Instalação
1. Abra o navegador
2. Acesse: `http://localhost/gerenciador_itens`
3. Você deve ver a interface do sistema carregando

## 🐧 Instalação no Linux (Ubuntu/Debian)

### Passo 1: Instalar Dependências
```bash
# Atualizar repositórios
sudo apt update

# Instalar Apache, PHP e MySQL
sudo apt install apache2 php php-mysql mysql-server

# Instalar extensões PHP necessárias
sudo apt install php-json php-pdo php-pdo-mysql
```

### Passo 2: Configurar MySQL
```bash
# Configurar MySQL
sudo mysql_secure_installation

# Acessar MySQL
sudo mysql -u root -p

# Criar banco de dados
CREATE DATABASE gerenciador_itens;
CREATE USER 'gerenciador'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON gerenciador_itens.* TO 'gerenciador'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Passo 3: Configurar Arquivos
```bash
# Navegar para diretório web
cd /var/www/html

# Criar diretório do projeto
sudo mkdir gerenciador_itens
sudo chown $USER:$USER gerenciador_itens

# Copiar arquivos (ajuste o caminho conforme necessário)
cp -r /caminho/para/arquivos/* gerenciador_itens/
```

### Passo 4: Ajustar Configurações
Edite o arquivo `server.php` e ajuste as configurações de conexão:
```php
$config = [
    'host' => 'localhost',
    'dbname' => 'gerenciador_itens',
    'username' => 'gerenciador',
    'password' => 'senha123',
    'charset' => 'utf8mb4'
];
```

### Passo 5: Configurar Permissões
```bash
# Definir permissões corretas
sudo chown -R www-data:www-data /var/www/html/gerenciador_itens
sudo chmod -R 755 /var/www/html/gerenciador_itens
```

## 🍎 Instalação no macOS

### Passo 1: Instalar Homebrew (se não tiver)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Passo 2: Instalar Dependências
```bash
# Instalar PHP e MySQL
brew install php mysql

# Iniciar MySQL
brew services start mysql
```

### Passo 3: Configurar MySQL
```bash
# Configurar MySQL
mysql_secure_installation

# Criar banco de dados
mysql -u root -p
CREATE DATABASE gerenciador_itens;
EXIT;
```

### Passo 4: Usar Servidor Built-in do PHP
```bash
# Navegar para pasta do projeto
cd /caminho/para/gerenciador_itens

# Iniciar servidor
php -S localhost:8000
```

## 🪟 Instalação no Windows (sem XAMPP)

### Passo 1: Instalar PHP
1. Baixe PHP em [https://windows.php.net/download](https://windows.php.net/download)
2. Extraia para `C:\php`
3. Adicione `C:\php` ao PATH do sistema

### Passo 2: Instalar MySQL
1. Baixe MySQL em [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
2. Execute o instalador
3. Configure usuário root com senha

### Passo 3: Configurar e Executar
```cmd
# Navegar para pasta do projeto
cd C:\caminho\para\gerenciador_itens

# Iniciar servidor PHP
php -S localhost:8000
```

## 🔧 Configurações Avançadas

### Configuração de Produção

#### Apache Virtual Host
Crie um arquivo de configuração em `/etc/apache2/sites-available/gerenciador.conf`:
```apache
<VirtualHost *:80>
    ServerName gerenciador.local
    DocumentRoot /var/www/html/gerenciador_itens
    
    <Directory /var/www/html/gerenciador_itens>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/gerenciador_error.log
    CustomLog ${APACHE_LOG_DIR}/gerenciador_access.log combined
</VirtualHost>
```

Ativar o site:
```bash
sudo a2ensite gerenciador.conf
sudo systemctl reload apache2
```

#### Arquivo .htaccess
Crie um arquivo `.htaccess` na raiz do projeto:
```apache
RewriteEngine On

# Redirecionar para HTTPS (se disponível)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache para arquivos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### Configuração de Segurança

#### Configurações PHP (php.ini)
```ini
# Desabilitar exibição de erros em produção
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

# Configurações de segurança
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

# Limites de upload
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 30
```

#### Configurações MySQL
```sql
-- Criar usuário específico para a aplicação
CREATE USER 'app_gerenciador'@'localhost' IDENTIFIED BY 'senha_forte_aqui';
GRANT SELECT, INSERT, UPDATE, DELETE ON gerenciador_itens.* TO 'app_gerenciador'@'localhost';
FLUSH PRIVILEGES;
```

## 🐳 Instalação com Docker

### Dockerfile
```dockerfile
FROM php:8.1-apache

# Instalar extensões PHP
RUN docker-php-ext-install pdo pdo_mysql

# Copiar arquivos
COPY . /var/www/html/

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_NAME=gerenciador_itens
      - DB_USER=root
      - DB_PASS=senha123

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: senha123
      MYSQL_DATABASE: gerenciador_itens
    volumes:
      - ./banco.sql:/docker-entrypoint-initdb.d/banco.sql
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### Executar com Docker
```bash
# Construir e executar
docker-compose up -d

# Acessar em http://localhost:8080
```

## 🔍 Solução de Problemas

### Problemas Comuns

#### Erro: "Connection refused"
**Causa**: Serviços não estão rodando
**Solução**: 
- Verifique se Apache/MySQL estão iniciados
- No XAMPP, verifique o Control Panel
- No Linux: `sudo systemctl status apache2 mysql`

#### Erro: "Access denied for user"
**Causa**: Configurações de banco incorretas
**Solução**:
- Verifique credenciais no `server.php`
- Teste conexão manual: `mysql -u root -p`
- Recrie usuário se necessário

#### Erro: "Call to undefined function"
**Causa**: Extensões PHP não instaladas
**Solução**:
- Instale extensões: `sudo apt install php-mysql php-pdo`
- Reinicie Apache: `sudo systemctl restart apache2`

#### Página em branco
**Causa**: Erro PHP não exibido
**Solução**:
- Ative exibição de erros temporariamente
- Verifique logs: `/var/log/apache2/error.log`
- Teste arquivo PHP simples: `<?php phpinfo(); ?>`

#### Animações não funcionam
**Causa**: JavaScript desabilitado ou CDN inacessível
**Solução**:
- Verifique se JavaScript está habilitado
- Teste conexão com CDN do Anime.js
- Use versão local da biblioteca se necessário

### Logs e Debugging

#### Habilitar Logs PHP
```php
// Adicionar no início do server.php para debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
```

#### Verificar Logs Apache
```bash
# Ubuntu/Debian
sudo tail -f /var/log/apache2/error.log

# CentOS/RHEL
sudo tail -f /var/log/httpd/error_log
```

#### Debug JavaScript
```javascript
// Adicionar no console do navegador
console.log('Debug ativo');

// Verificar se Anime.js carregou
console.log(typeof anime);
```

## 📞 Suporte

### Recursos de Ajuda
- **Documentação PHP**: [https://www.php.net/docs.php](https://www.php.net/docs.php)
- **MySQL Documentation**: [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
- **Anime.js Documentation**: [https://animejs.com/documentation/](https://animejs.com/documentation/)
- **XAMPP FAQ**: [https://www.apachefriends.org/faq.html](https://www.apachefriends.org/faq.html)

### Checklist de Verificação
- [ ] PHP 8.1+ instalado e funcionando
- [ ] MySQL rodando e acessível
- [ ] Banco de dados `gerenciador_itens` criado
- [ ] Tabela `itens` criada com dados de exemplo
- [ ] Arquivos copiados para diretório correto
- [ ] Permissões de arquivo configuradas
- [ ] Configurações de conexão corretas no `server.php`
- [ ] Navegador com JavaScript habilitado
- [ ] Acesso à internet para CDNs (Anime.js, Font Awesome, Google Fonts)

---

**Dica**: Sempre teste em ambiente local antes de fazer deploy em produção!
