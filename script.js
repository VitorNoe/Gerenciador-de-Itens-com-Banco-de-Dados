// CRUD de itens via API REST
const tabela = document.getElementById('tabelaItens').querySelector('tbody');
const form = document.getElementById('itemForm');
let editId = null;

function renderItens(itens) {
  tabela.innerHTML = '';
  itens.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.nome}</td><td>${item.tipo}</td><td>${item.quantidade}</td>
      <td>
        <button onclick="editar(${item.id})">Editar</button>
        <button onclick="excluir(${item.id})">Excluir</button>
      </td>`;
    tabela.appendChild(tr);
  });
}

function buscarItens() {
  fetch('server.php?endpoint=itens')
    .then(r => r.json())
    .then(renderItens)
    .catch(() => alert('Erro ao buscar itens!'));
}

form.onsubmit = e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const tipo = document.getElementById('tipo').value.trim();
  const quantidade = parseInt(document.getElementById('quantidade').value, 10);
  if (!nome || !tipo || !quantidade) return;
  const metodo = editId ? 'PUT' : 'POST';
  const body = JSON.stringify({ nome, tipo, quantidade, id: editId });
  fetch('server.php?endpoint=itens', {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body
  })
    .then(() => {
      form.reset();
      editId = null;
      buscarItens();
    })
    .catch(() => alert('Erro ao salvar item!'));
};

window.editar = id => {
  fetch(`server.php?endpoint=itens&id=${id}`)
    .then(r => r.json())
    .then(item => {
      document.getElementById('nome').value = item.nome;
      document.getElementById('tipo').value = item.tipo;
      document.getElementById('quantidade').value = item.quantidade;
      editId = item.id;
    });
};

window.excluir = id => {
  if (confirm('Excluir este item?')) {
    fetch('server.php?endpoint=itens', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(() => buscarItens())
      .catch(() => alert('Erro ao excluir item!'));
  }
};

// Inicialização
buscarItens();
