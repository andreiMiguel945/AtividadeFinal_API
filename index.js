require('dotenv').config();
const express = require('express');
const cors = require('cors'); 

// Conexão com o banco de dados
const db = require('./database');
const app = express();
app.use(cors());
app.use(express.json());



//importação do módulo de autenticação (função)   
const { autenticar, verificarToken } = require('./autenticacao_JWT');
autenticar(app, db);

// 3. Usar variáveis
const JWT_SECRET = process.env.JWT_SECRET;

let produtos = [
    { id: 1, nome: "Anne Frank", preco: 50, categoria: "História", estoque: 30 },
    { id: 2, nome: "Entendendo Algoritmos", preco: 39, categoria: "Informática", estoque: 50 },
    { id: 3, nome: "Diário de uma banana", preco: 45, categoria: "Comédia", estoque: 45 },
    { id: 4, nome: "Clean Code", preco: 60, categoria: "Programação", estoque: 25 },
    { id: 5, nome: "Dom Casmurro", preco: 35, categoria: "Literatura", estoque: 40 },
    { id: 6, nome: "O Hobbit", preco: 55, categoria: "Fantasia", estoque: 20 },
    { id: 7, nome: "1984", preco: 48, categoria: "Ficção", estoque: 32 },
    { id: 8, nome: "A Revolução dos Bichos", preco: 30, categoria: "Ficção", estoque: 28 },
    { id: 9, nome: "JavaScript: O Guia Definitivo", preco: 70, categoria: "Programação", estoque: 15 },
    { id: 10, nome: "Pai Rico, Pai Pobre", preco: 42, categoria: "Finanças", estoque: 38 },
    { id: 11, nome: "Harry Potter", preco: 52, categoria: "Fantasia", estoque: 18 },
    { id: 12, nome: "O Senhor dos Anéis", preco: 80, categoria: "Fantasia", estoque: 12 },
    { id: 13, nome: "Percy Jackson", preco: 44, categoria: "Fantasia", estoque: 20 },
    { id: 14, nome: "Código Limpo", preco: 58, categoria: "Programação", estoque: 16 },
    { id: 15, nome: "Algoritmos", preco: 65, categoria: "Informática", estoque: 10 },
    { id: 16, nome: "Sherlock Holmes", preco: 37, categoria: "Mistério", estoque: 24 },
    { id: 17, nome: "A Culpa é das Estrelas", preco: 40, categoria: "Romance", estoque: 22 },
    { id: 18, nome: "It: A Coisa", preco: 62, categoria: "Terror", estoque: 8 },
    { id: 19, nome: "Drácula", preco: 33, categoria: "Terror", estoque: 14 },
    { id: 20, nome: "Mindset", preco: 47, categoria: "Desenvolvimento", estoque: 19 }
];

let proximoId = 21;

// =====================
// GET - LISTAR PRODUTOS (Público)
// =====================
app.get('/api/produtos', (req, res) => {
    const { categoria, preco_max, preco_min } = req.query;

    try {
        let sql = "SELECT * FROM produtos WHERE 1=1";
        const params = [];

        if (categoria) {
            sql += " AND categoria_id = (SELECT id FROM categorias WHERE nome = ?)";
            params.push(categoria);
        }
        if (preco_max) {
            sql += " AND preco <= ?";
            params.push(Number(preco_max));
        }
        if (preco_min) {
            sql += " AND preco >= ?";
            params.push(Number(preco_min));
        }

        const dados = db.prepare(sql).all(params);
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar produtos no banco" });
    }
});

// =====================
// POST - CRIAR PRODUTO (Protegido)
// =====================
// Removido o 'autenticar' daqui. Usamos apenas 'verificarToken'
app.post('/api/produtos', verificarToken, (req, res) => {
    const { nome, preco, estoque, categoria_id } = req.body;

    if (!nome || !preco || !categoria_id) {
        return res.status(400).json({ erro: "Campos obrigatórios: nome, preco, categoria_id" });
    }

    try {
        const info = db.prepare(
            'INSERT INTO produtos (nome, preco, estoque, categoria_id) VALUES (?, ?, ?, ?)'
        ).run(nome, preco, estoque, categoria_id);

        const novo = db.prepare('SELECT * FROM produtos WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json(novo);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao inserir produto. Verifique se o nome é único." });
    }
});

// =====================
// PUT - ATUALIZAR PRODUTO (Protegido)
// =====================
app.put('/api/produtos/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { nome, preco, estoque, categoria_id } = req.body;

    try {
        const info = db.prepare(
            'UPDATE produtos SET nome = ?, preco = ?, estoque = ?, categoria_id = ? WHERE id = ?'
        ).run(nome, preco, estoque, categoria_id, id);

        if (info.changes === 0) return res.status(404).json({ erro: "Produto não encontrado" });
        res.json({ mensagem: "Produto atualizado com sucesso" });
    } catch (error) {
        res.status(400).json({ erro: "Erro ao atualizar produto" });
    }
});

// =====================
// DELETE - REMOVER PRODUTO (Protegido)
// =====================
app.delete('/api/produtos/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    try {
        const info = db.prepare('DELETE FROM produtos WHERE id = ?').run(id);
        if (info.changes === 0) return res.status(404).json({ erro: "Produto não encontrado" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar produto" });
    }
});

// =====================
// SERVIDOR
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
