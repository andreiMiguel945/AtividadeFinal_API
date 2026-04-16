const express = require('express');
const app = express();

app.use(express.json());

// Conexão com o banco de dados
const db = require('./dataBase');

//importação do módulo de autenticação (função)   
const { autenticar, verificarToken } = require('./autenticacao_JWT');
autenticar(app, db);

// =====================
// ROTA INICIAL
// =====================
// GET /api/categorias - Listar todas
app.get('/api/categorias', (req, res) => {
    const categorias = db.prepare('SELECT * FROM categorias').all();
    res.json(categorias);
});

// GET /api/categorias/:id - Buscar por ID (com produtos!)
app.get('/api/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    // Buscar categoria
    const categoria = db.prepare(
        'SELECT * FROM categorias WHERE id = ?'
    ).get(id);
    
    if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    
    // Buscar produtos desta categoria
    const produtos = db.prepare(
        'SELECT * FROM produtos WHERE categoria_id = ?'
    ).all(id);
    
    // Retornar categoria + produtos
    res.json({
        ...categoria,
        produtos: produtos
    });
});

// POST /api/categorias - Criar categoria
app.post('/api/categorias', autenticar, (req, res) => {
    const { nome, descricao } = req.body;
    
    if (!nome) {
        return res.status(400).json({ erro: 'Nome obrigatório' });
    }
    
    const result = db.prepare(
        'INSERT INTO categorias (nome, descricao) VALUES (?, ?)'
    ).run(nome, descricao);
    
    const categoria = db.prepare(
        'SELECT * FROM categorias WHERE id = ?'
    ).get(result.lastInsertRowid);
    
    res.status(201).json(categoria);
});

// DELETE /api/categorias/:id - Com validação!
app.delete('/api/categorias/:id', autenticar, (req, res) => {
    const id = parseInt(req.params.id);
    
    // Verificar se tem produtos
    const temProdutos = db.prepare(
        'SELECT COUNT(*) as total FROM produtos WHERE categoria_id = ?'
    ).get(id);
    
    if (temProdutos.total > 0) {
        return res.status(400).json({ 
            erro: `Não pode deletar. Categoria tem ${temProdutos.total} produtos`
        });
    }
    
    db.prepare('DELETE FROM categorias WHERE id = ?').run(id);
    res.status(204).send();
});
            