# Gerenciador de Itens

Um sistema completo de gerenciamento de itens com design moderno inspirado no estilo Frutiger Aero, desenvolvido com PHP, MySQL e JavaScript com animações usando Anime.js.

## 🎨 Características do Design

### Estilo Frutiger Aero
- **Cores vibrantes**: Gradientes em azul, ciano, verde e outras cores vivas
- **Elementos translúcidos**: Efeito glass morphism com backdrop-filter
- **Animações suaves**: Transições e animações usando Anime.js
- **Formas orgânicas**: Bordas arredondadas e elementos fluidos
- **Bolhas animadas**: Fundo com bolhas flutuantes em movimento
- **Tipografia moderna**: Fonte Inter com diferentes pesos

### Recursos Visuais
- Interface responsiva para desktop e mobile
- Animações de entrada e hover em todos os elementos
- Sistema de notificações toast com animações
- Modal de confirmação com efeitos visuais
- Loading spinner personalizado
- Transições suaves entre visualizações

## 🚀 Funcionalidades

### CRUD Completo
- ✅ **Create**: Adicionar novos itens com validação
- ✅ **Read**: Listar itens com filtros e busca
- ✅ **Update**: Editar itens existentes
- ✅ **Delete**: Excluir itens com confirmação

### Recursos Avançados
- **Filtros dinâmicos**: Busca por nome e filtro por tipo
- **Duas visualizações**: Grid cards e tabela
- **Estatísticas em tempo real**: Total de itens, quantidade e valor
- **Validação de formulário**: Campos obrigatórios e tipos de dados
- **Notificações**: Sistema de toast para feedback do usuário
- **Responsividade**: Funciona perfeitamente em dispositivos móveis

### Campos dos Itens
- Nome (obrigatório)
- Tipo (obrigatório) - Eletrônicos, Periféricos, Acessórios, Móveis, Outros
- Quantidade (obrigatório)
- Preço (opcional)
- Descrição (opcional)
- Data de criação e atualização (automático)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Estilo Frutiger Aero com gradientes e efeitos
- **JavaScript ES6+**: Funcionalidades interativas
- **Anime.js**: Biblioteca de animações
- **Font Awesome**: Ícones vetoriais
- **Google Fonts**: Tipografia Inter

### Backend
- **PHP 8.1+**: Servidor e API REST
- **MySQL**: Banco de dados relacional
- **PDO**: Conexão segura com o banco
- **JSON**: Formato de dados da API

### Recursos Técnicos
- **API REST**: Endpoints GET, POST, PUT, DELETE
- **CORS**: Suporte a requisições cross-origin
- **Soft Delete**: Exclusão lógica dos registros
- **Prepared Statements**: Proteção contra SQL Injection
- **Error Handling**: Tratamento robusto de erros
- **Debounce**: Otimização de filtros em tempo real

## 📁 Estrutura do Projeto

```
gerenciador_itens/
├── index.html          # Interface principal
├── style.css           # Estilos Frutiger Aero
├── script.js           # JavaScript com animações
├── server.php          # API REST em PHP
├── banco.sql           # Estrutura do banco de dados
└── README.md           # Documentação
```

## 🗄️ Banco de Dados

### Tabela: itens
```sql
CREATE TABLE itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  quantidade INT NOT NULL DEFAULT 0,
  descricao TEXT,
  preco DECIMAL(10,2) DEFAULT 0.00,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE
);
```

### Índices
- `idx_nome`: Otimização para busca por nome
- `idx_tipo`: Otimização para filtro por tipo
- `idx_ativo`: Otimização para soft delete

## 🔧 Instalação e Configuração

### Pré-requisitos
- XAMPP ou servidor com PHP 8.1+ e MySQL
- Navegador moderno com suporte a ES6+

### Passo a Passo

1. **Clone ou baixe os arquivos**
   ```bash
   # Coloque os arquivos na pasta htdocs do XAMPP
   C:\xampp\htdocs\gerenciador_itens\
   ```

2. **Configure o banco de dados**
   - Abra o phpMyAdmin (http://localhost/phpmyadmin)
   - Execute o script `banco.sql`
   - Verifique se o banco `gerenciador_itens` foi criado

3. **Configure a conexão**
   - Abra o arquivo `server.php`
   - Ajuste as configurações de conexão se necessário:
   ```php
   $config = [
       'host' => 'localhost',
       'dbname' => 'gerenciador_itens',
       'username' => 'root',
       'password' => '',
   ];
   ```

4. **Inicie o XAMPP**
   - Inicie Apache e MySQL
   - Acesse: http://localhost/gerenciador_itens

### Configuração Alternativa (Servidor PHP Built-in)
```bash
# Na pasta do projeto
php -S localhost:8000
```

## 🎯 API Endpoints

### Itens
- `GET /server.php?endpoint=itens` - Listar todos os itens
- `GET /server.php?endpoint=itens&id=1` - Buscar item específico
- `GET /server.php?endpoint=itens&nome=notebook` - Filtrar por nome
- `GET /server.php?endpoint=itens&tipo=Eletrônicos` - Filtrar por tipo
- `POST /server.php?endpoint=itens` - Criar novo item
- `PUT /server.php?endpoint=itens` - Atualizar item
- `DELETE /server.php?endpoint=itens` - Excluir item (soft delete)

### Estatísticas
- `GET /server.php?endpoint=stats` - Obter estatísticas gerais

### Exemplo de Requisição
```javascript
// Criar novo item
fetch('server.php?endpoint=itens', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Notebook Dell',
    tipo: 'Eletrônicos',
    quantidade: 5,
    preco: 2500.00,
    descricao: 'Notebook Dell Inspiron'
  })
});
```

## 🎨 Personalização do Estilo

### Variáveis CSS
O arquivo `style.css` utiliza variáveis CSS para facilitar a personalização:

```css
:root {
  --primary-blue: #00a8ff;
  --secondary-blue: #0097e6;
  --light-blue: #74b9ff;
  --cyan: #00cec9;
  --green: #00b894;
  --lime: #55efc4;
  /* ... mais cores */
}
```

### Gradientes Principais
- `--gradient-primary`: Azul para ciano
- `--gradient-secondary`: Azul claro para roxo
- `--gradient-accent`: Verde lima para amarelo
- `--gradient-warm`: Laranja para rosa

## 🔄 Animações

### Anime.js
O projeto utiliza a biblioteca Anime.js para animações suaves:

- **Entrada da página**: Animação em cascata dos elementos
- **Cards de itens**: Animação staggered ao carregar
- **Estatísticas**: Contadores animados
- **Formulário**: Efeitos de foco e validação
- **Modal**: Animações de entrada e saída
- **Toast**: Notificações deslizantes
- **Bolhas de fundo**: Movimento contínuo

### Exemplos de Animação
```javascript
// Animação de entrada dos cards
anime({
  targets: '.item-card',
  translateY: [30, 0],
  opacity: [0, 1],
  delay: anime.stagger(100),
  duration: 600,
  easing: 'easeOutCubic'
});
```

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 768px - Layout completo
- **Tablet**: 768px - Ajustes de grid
- **Mobile**: < 480px - Layout em coluna única

### Adaptações Mobile
- Header em coluna
- Formulário em uma coluna
- Grid de itens em coluna única
- Modal responsivo
- Touch-friendly buttons

## 🔒 Segurança

### Medidas Implementadas
- **Prepared Statements**: Proteção contra SQL Injection
- **Validação de dados**: Frontend e backend
- **Soft Delete**: Preservação de dados
- **CORS configurado**: Controle de acesso
- **Error Handling**: Não exposição de dados sensíveis

## 🚀 Performance

### Otimizações
- **Debounce**: Filtros com delay para reduzir requisições
- **Índices de banco**: Consultas otimizadas
- **CSS otimizado**: Uso de variáveis e reutilização
- **JavaScript modular**: Código organizado em classes
- **Lazy loading**: Carregamento sob demanda

## 🧪 Testes

### Funcionalidades Testadas
- ✅ Criação de itens
- ✅ Listagem e filtros
- ✅ Edição de itens
- ✅ Exclusão com confirmação
- ✅ Validação de formulário
- ✅ Responsividade
- ✅ Animações
- ✅ API endpoints

### Navegadores Suportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Próximas Melhorias

### Funcionalidades Futuras
- [ ] Sistema de categorias personalizadas
- [ ] Upload de imagens para itens
- [ ] Exportação para Excel/PDF
- [ ] Histórico de alterações
- [ ] Sistema de usuários
- [ ] Dashboard com gráficos
- [ ] API de integração
- [ ] Modo escuro

### Melhorias Técnicas
- [ ] Cache de dados
- [ ] Paginação
- [ ] Busca avançada
- [ ] Ordenação customizada
- [ ] Backup automático
- [ ] Logs de auditoria

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e comerciais.

## 👨‍💻 Desenvolvimento

Desenvolvido com foco em:
- **UX/UI moderno**: Interface intuitiva e atrativa
- **Performance**: Carregamento rápido e responsivo
- **Acessibilidade**: Compatível com leitores de tela
- **Manutenibilidade**: Código limpo e documentado
- **Escalabilidade**: Estrutura preparada para crescimento

---

**Versão**: 1.0.0  
**Data**: 06/08/2025  
**Estilo**: Frutiger Aero  
**Tecnologias**: PHP, MySQL, JavaScript, Anime.js
