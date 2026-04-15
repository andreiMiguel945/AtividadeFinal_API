const express = require('express');
const app = express();

app.use(express.json());

// Conexão com o banco de dados
const db = require('./dataBase');
//importação do módulo de autenticação (função)   
const { autenticar, verificarToken } = require('./autenticacao_JWT');
autenticar(app, db);

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
// ROTA INICIAL
// =====================
app.get('/', (req, res) => {
    res.json(produtos);
});

// =====================
// GET - LISTAR PRODUTOS
// =====================
app.get('/api/produtos', (req, res) => {
    const {
        categoria,
        preco_max,
        preco_min,
        ordem,
        direcao,
        pagina = 1,
        limite = 10
    } = req.query;

    let resultado = [...produtos];

    // filtros
    if (categoria) {
        resultado = resultado.filter(p => p.categoria === categoria);
    }

    if (preco_max) {
        resultado = resultado.filter(p => p.preco <= Number(preco_max));
    }

    if (preco_min) {
        resultado = resultado.filter(p => p.preco >= Number(preco_min));
    }

    // ordenação
    if (ordem === "preco") {
        resultado.sort((a, b) =>
            direcao === "desc" ? b.preco - a.preco : a.preco - b.preco
        );
    }

    if (ordem === "nome") {
        resultado.sort((a, b) =>
            direcao === "desc"
                ? b.nome.localeCompare(a.nome)
                : a.nome.localeCompare(b.nome)
        );
    }

    // paginação
    const paginaNum = Number(pagina);
    const limiteNum = Number(limite);
    const inicio = (paginaNum - 1) * limiteNum;

    const dados = resultado.slice(inicio, inicio + limiteNum);

    res.json({
        dados,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});

// =====================
// GET POR ID
// =====================
app.get('/api/produtos/:id', (req, res) => {
    const produto = produtos.find(p => p.id === Number(req.params.id));

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produto);
});

// =====================
// POST
// =====================
app.post('/api/produtos', verificarToken, (req,res) => {
    const { nome, preco, categoria, estoque } = req.body;

    if (!nome || !preco || !categoria) {
        return res.status(400).json({
            erro: "Campos obrigatórios: nome, preco, categoria"
        });
    }

    const novoProduto = {
        id: proximoId++,
        nome,
        preco,
        categoria,
        estoque: estoque || 0
    };

    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});

// =====================
// PUT
// =====================
app.put('/api/produtos/:id', verificarToken, (req,res) =>  {
    const produto = produtos.find(p => p.id === Number(req.params.id));

    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const { nome, preco, categoria, estoque } = req.body;

    produto.nome = nome;
    produto.preco = preco;
    produto.categoria = categoria;
    produto.estoque = estoque;

    res.json(produto);
});

// =====================
// DELETE
// =====================
app.delete('/api/produtos/:id', verificarToken, (req,res) => {
    const index = produtos.findIndex(p => p.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    produtos.splice(index, 1);

    res.status(204).send();
});

// =====================
// SERVIDOR
// =====================
app.listen(3000, () => {
    console.log('🚀 API rodando em http://localhost:3000');
});