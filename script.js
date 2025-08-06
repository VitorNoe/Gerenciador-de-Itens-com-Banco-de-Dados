// Gerenciador de Itens - JavaScript com Anime.js
// Configurações globais
const API_BASE_URL = 'server.php';
let currentView = 'grid';
let editingItemId = null;
let items = [];
let filteredItems = [];

// Elementos DOM
const elements = {
    // Formulário
    form: document.getElementById('itemForm'),
    formTitle: document.getElementById('formTitle'),
    btnSubmit: document.getElementById('btnSubmit'),
    btnCancelar: document.getElementById('btnCancelar'),
    
    // Campos do formulário
    nome: document.getElementById('nome'),
    tipo: document.getElementById('tipo'),
    quantidade: document.getElementById('quantidade'),
    preco: document.getElementById('preco'),
    descricao: document.getElementById('descricao'),
    
    // Filtros
    filtroNome: document.getElementById('filtroNome'),
    filtroTipo: document.getElementById('filtroTipo'),
    btnLimparFiltros: document.getElementById('btnLimparFiltros'),
    
    // Visualização
    itemsGrid: document.getElementById('itemsGrid'),
    tableContainer: document.getElementById('tableContainer'),
    tableBody: document.getElementById('tableBody'),
    loading: document.getElementById('loading'),
    emptyState: document.getElementById('emptyState'),
    
    // Estatísticas
    totalItens: document.getElementById('totalItens'),
    totalQuantidade: document.getElementById('totalQuantidade'),
    valorTotal: document.getElementById('valorTotal'),
    
    // Modal
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    modalClose: document.getElementById('modalClose'),
    modalCancel: document.getElementById('modalCancel'),
    modalConfirm: document.getElementById('modalConfirm'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// Classe para gerenciar notificações toast
class ToastManager {
    static show(message, type = 'success', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        elements.toastContainer.appendChild(toast);
        
        // Animação de entrada
        anime({
            targets: toast,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
        
        // Fechar ao clicar no X
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.hide(toast);
        });
        
        // Auto-fechar
        setTimeout(() => {
            this.hide(toast);
        }, duration);
    }
    
    static hide(toast) {
        anime({
            targets: toast,
            translateX: 300,
            opacity: 0,
            duration: 300,
            easing: 'easeInCubic',
            complete: () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }
        });
    }
    
    static getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Classe para gerenciar o modal
class ModalManager {
    static show(title, message, onConfirm) {
        elements.modalTitle.textContent = title;
        elements.modalMessage.textContent = message;
        elements.modalOverlay.classList.add('active');
        
        // Animação de entrada
        anime({
            targets: elements.modalOverlay.querySelector('.modal'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
        
        // Configurar eventos
        const handleConfirm = () => {
            this.hide();
            if (onConfirm) onConfirm();
        };
        
        const handleCancel = () => {
            this.hide();
        };
        
        elements.modalConfirm.onclick = handleConfirm;
        elements.modalCancel.onclick = handleCancel;
        elements.modalClose.onclick = handleCancel;
        
        // Fechar com ESC
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }
    
    static hide() {
        anime({
            targets: elements.modalOverlay.querySelector('.modal'),
            scale: 0.8,
            opacity: 0,
            duration: 200,
            easing: 'easeInCubic',
            complete: () => {
                elements.modalOverlay.classList.remove('active');
            }
        });
    }
}

// Classe para gerenciar a API
class ApiManager {
    static async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}?endpoint=${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    static async getItems(filtros = {}) {
        const params = new URLSearchParams();
        if (filtros.nome) params.append('nome', filtros.nome);
        if (filtros.tipo) params.append('tipo', filtros.tipo);
        
        const endpoint = `itens${params.toString() ? '&' + params.toString() : ''}`;
        return await this.request(endpoint);
    }
    
    static async getItem(id) {
        return await this.request(`itens&id=${id}`);
    }
    
    static async createItem(data) {
        return await this.request('itens', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    static async updateItem(data) {
        return await this.request('itens', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    static async deleteItem(id) {
        return await this.request('itens', {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    }
    
    static async getStats() {
        return await this.request('stats');
    }
}

// Função para mostrar loading
function showLoading() {
    elements.loading.style.display = 'flex';
    elements.itemsGrid.style.display = 'none';
    elements.tableContainer.style.display = 'none';
    elements.emptyState.style.display = 'none';
}

// Função para esconder loading
function hideLoading() {
    elements.loading.style.display = 'none';
}

// Função para carregar itens
async function loadItems() {
    try {
        showLoading();
        
        const filtros = {
            nome: elements.filtroNome.value.trim(),
            tipo: elements.filtroTipo.value
        };
        
        items = await ApiManager.getItems(filtros);
        filteredItems = [...items];
        
        hideLoading();
        renderItems();
        updateStats();
        
        // Animação dos itens
        if (currentView === 'grid') {
            anime({
                targets: '.item-card',
                translateY: [30, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                duration: 600,
                easing: 'easeOutCubic'
            });
        }
        
    } catch (error) {
        hideLoading();
        ToastManager.show('Erro ao carregar itens', 'error');
        console.error('Erro ao carregar itens:', error);
    }
}

// Função para renderizar itens
function renderItems() {
    if (filteredItems.length === 0) {
        elements.itemsGrid.style.display = 'none';
        elements.tableContainer.style.display = 'none';
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.emptyState.style.display = 'none';
    
    if (currentView === 'grid') {
        renderGridView();
    } else {
        renderTableView();
    }
}

// Função para renderizar visualização em grid
function renderGridView() {
    elements.itemsGrid.style.display = 'grid';
    elements.tableContainer.style.display = 'none';
    
    elements.itemsGrid.innerHTML = filteredItems.map(item => `
        <div class="item-card" data-id="${item.id}">
            <div class="item-header">
                <div>
                    <div class="item-title">${item.nome}</div>
                    <span class="item-type">${item.tipo}</span>
                </div>
            </div>
            <div class="item-details">
                <div class="item-detail">
                    <i class="fas fa-sort-numeric-up"></i>
                    <span>Qtd: ${item.quantidade}</span>
                </div>
                <div class="item-detail">
                    <i class="fas fa-dollar-sign"></i>
                    <span>R$ ${parseFloat(item.preco || 0).toFixed(2)}</span>
                </div>
            </div>
            ${item.descricao ? `<div class="item-description">${item.descricao}</div>` : ''}
            <div class="item-actions">
                <button class="btn-primary btn-small" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn-danger btn-small" onclick="confirmDeleteItem(${item.id}, '${item.nome}')">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Função para renderizar visualização em tabela
function renderTableView() {
    elements.itemsGrid.style.display = 'none';
    elements.tableContainer.style.display = 'block';
    
    elements.tableBody.innerHTML = filteredItems.map(item => `
        <tr data-id="${item.id}">
            <td>${item.nome}</td>
            <td><span class="item-type">${item.tipo}</span></td>
            <td>${item.quantidade}</td>
            <td>R$ ${parseFloat(item.preco || 0).toFixed(2)}</td>
            <td>R$ ${(parseFloat(item.preco || 0) * parseInt(item.quantidade)).toFixed(2)}</td>
            <td>
                <button class="btn-primary btn-small" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger btn-small" onclick="confirmDeleteItem(${item.id}, '${item.nome}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Função para atualizar estatísticas
async function updateStats() {
    try {
        const stats = await ApiManager.getStats();
        
        // Animação dos números
        anime({
            targets: elements.totalItens,
            innerHTML: [0, stats.total_itens || 0],
            duration: 1000,
            round: 1,
            easing: 'easeOutCubic'
        });
        
        anime({
            targets: elements.totalQuantidade,
            innerHTML: [0, stats.total_quantidade || 0],
            duration: 1000,
            round: 1,
            easing: 'easeOutCubic'
        });
        
        // Formatar valor total
        const valorTotal = parseFloat(stats.valor_total || 0);
        anime({
            targets: { value: 0 },
            value: valorTotal,
            duration: 1000,
            round: 100,
            easing: 'easeOutCubic',
            update: function(anim) {
                elements.valorTotal.textContent = `R$ ${anim.animatables[0].target.value.toFixed(2)}`;
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Função para editar item
async function editItem(id) {
    try {
        const item = await ApiManager.getItem(id);
        
        if (!item) {
            ToastManager.show('Item não encontrado', 'error');
            return;
        }
        
        // Preencher formulário
        elements.nome.value = item.nome;
        elements.tipo.value = item.tipo;
        elements.quantidade.value = item.quantidade;
        elements.preco.value = item.preco || '';
        elements.descricao.value = item.descricao || '';
        
        // Atualizar interface
        editingItemId = id;
        elements.formTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Item';
        elements.btnSubmit.innerHTML = '<i class="fas fa-save"></i> <span>Atualizar Item</span>';
        elements.btnCancelar.style.display = 'inline-flex';
        
        // Scroll para o formulário
        elements.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Animação de foco
        anime({
            targets: elements.form.closest('.glass-card'),
            scale: [1, 1.02, 1],
            duration: 600,
            easing: 'easeOutCubic'
        });
        
        // Foco no primeiro campo
        elements.nome.focus();
        
    } catch (error) {
        ToastManager.show('Erro ao carregar item para edição', 'error');
        console.error('Erro ao editar item:', error);
    }
}

// Função para confirmar exclusão
function confirmDeleteItem(id, nome) {
    ModalManager.show(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o item "${nome}"? Esta ação não pode ser desfeita.`,
        () => deleteItem(id)
    );
}

// Função para excluir item
async function deleteItem(id) {
    try {
        await ApiManager.deleteItem(id);
        ToastManager.show('Item excluído com sucesso', 'success');
        
        // Animação de saída
        const itemElement = document.querySelector(`[data-id="${id}"]`);
        if (itemElement) {
            anime({
                targets: itemElement,
                scale: 0,
                opacity: 0,
                duration: 300,
                easing: 'easeInCubic',
                complete: () => {
                    loadItems();
                }
            });
        } else {
            loadItems();
        }
        
    } catch (error) {
        ToastManager.show('Erro ao excluir item', 'error');
        console.error('Erro ao excluir item:', error);
    }
}

// Função para cancelar edição
function cancelEdit() {
    editingItemId = null;
    elements.form.reset();
    elements.formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Novo Item';
    elements.btnSubmit.innerHTML = '<i class="fas fa-save"></i> <span>Salvar Item</span>';
    elements.btnCancelar.style.display = 'none';
    
    // Animação
    anime({
        targets: elements.form.closest('.glass-card'),
        scale: [1.02, 1],
        duration: 300,
        easing: 'easeOutCubic'
    });
}

// Função para limpar filtros
function clearFilters() {
    elements.filtroNome.value = '';
    elements.filtroTipo.value = '';
    
    // Animação
    anime({
        targets: [elements.filtroNome, elements.filtroTipo],
        scale: [0.95, 1],
        duration: 200,
        easing: 'easeOutCubic'
    });
    
    loadItems();
}

// Função para alternar visualização
function toggleView(view) {
    if (currentView === view) return;
    
    currentView = view;
    
    // Atualizar botões
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Animação de transição
    const currentContainer = currentView === 'grid' ? elements.tableContainer : elements.itemsGrid;
    
    anime({
        targets: currentContainer,
        opacity: 0,
        duration: 200,
        easing: 'easeInCubic',
        complete: () => {
            renderItems();
            
            const newContainer = currentView === 'grid' ? elements.itemsGrid : elements.tableContainer;
            anime({
                targets: newContainer,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Animação inicial da página
    anime.timeline()
        .add({
            targets: '.header',
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutCubic'
        })
        .add({
            targets: '.glass-card',
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(200),
            duration: 600,
            easing: 'easeOutCubic'
        }, '-=400');
    
    // Carregar dados iniciais
    loadItems();
    
    // Formulário
    elements.form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            nome: elements.nome.value.trim(),
            tipo: elements.tipo.value,
            quantidade: parseInt(elements.quantidade.value) || 0,
            preco: parseFloat(elements.preco.value) || 0,
            descricao: elements.descricao.value.trim()
        };
        
        if (!formData.nome || !formData.tipo) {
            ToastManager.show('Por favor, preencha os campos obrigatórios', 'warning');
            return;
        }
        
        try {
            // Animação do botão
            anime({
                targets: elements.btnSubmit,
                scale: [1, 0.95, 1],
                duration: 200,
                easing: 'easeOutCubic'
            });
            
            if (editingItemId) {
                formData.id = editingItemId;
                await ApiManager.updateItem(formData);
                ToastManager.show('Item atualizado com sucesso', 'success');
                cancelEdit();
            } else {
                await ApiManager.createItem(formData);
                ToastManager.show('Item criado com sucesso', 'success');
                elements.form.reset();
            }
            
            loadItems();
            
        } catch (error) {
            ToastManager.show('Erro ao salvar item', 'error');
            console.error('Erro ao salvar item:', error);
        }
    });
    
    // Botão cancelar
    elements.btnCancelar.addEventListener('click', cancelEdit);
    
    // Filtros
    elements.filtroNome.addEventListener('input', debounce(loadItems, 500));
    elements.filtroTipo.addEventListener('change', loadItems);
    elements.btnLimparFiltros.addEventListener('click', clearFilters);
    
    // Botões de visualização
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            toggleView(btn.dataset.view);
        });
    });
    
    // Fechar modal clicando fora
    elements.modalOverlay.addEventListener('click', function(e) {
        if (e.target === elements.modalOverlay) {
            ModalManager.hide();
        }
    });
    
    // Animações de hover nos cards de estatísticas
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                duration: 200,
                easing: 'easeOutCubic'
            });
        });
    });
    
    // Animação das bolhas de fundo
    setInterval(() => {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            anime({
                targets: bubble,
                translateX: anime.random(-20, 20),
                translateY: anime.random(-20, 20),
                duration: anime.random(2000, 4000),
                easing: 'easeInOutSine'
            });
        });
    }, 5000);
});

// Funções globais (para uso inline)
window.editItem = editItem;
window.confirmDeleteItem = confirmDeleteItem;
window.deleteItem = deleteItem;

// Função utilitária para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para validar formulário
function validateForm(data) {
    const errors = [];
    
    if (!data.nome || data.nome.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!data.tipo) {
        errors.push('Tipo é obrigatório');
    }
    
    if (data.quantidade < 0) {
        errors.push('Quantidade não pode ser negativa');
    }
    
    if (data.preco < 0) {
        errors.push('Preço não pode ser negativo');
    }
    
    return errors;
}

// Exportar para uso global se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ToastManager,
        ModalManager,
        ApiManager
    };
}

