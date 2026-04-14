const Database = require('better-sqlite3');
const db = new Database('loja.db');

// Habilitar Foreign Keys (IMPORTANTE no SQLite!)
db.exec('PRAGMA foreign_keys = ON');

// 1. Criar tabela categorias
const createCategorias = `
    CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.exec(createCategorias);

// 2. Criar tabela produtos (com FK)
const createProdutos = `
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        estoque INTEGER DEFAULT 0,
        categoria_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
    )
`;

db.exec(createProdutos);
const createUsuarios = `
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT
)
`;
db.exec(createUsuarios);
console.log('✅ Tabelas criadas com relacionamento!');

module.exports = db;
// Inserir categorias
const categorias = [
       { id: 1, nome: "História"},
    { id: 2, nome: "Informática"},
    { id: 3, nome: "Comédia"},
    { id: 4, nome: "Programação"},
    { id: 5, nome: "Literatura"},
    { id: 6, nome: "Fantasia"},
    { id: 7, nome: "Ficção"},
    { id: 8, nome: "Finanças"},
    { id: 9, nome: "Mistério"},
    { id: 10, nome: "Romance"},
    { id: 11, nome: "Terror"},
    { id: 12, nome: "Desenvolvimento"}
];

const stmtCat = db.prepare(
    'INSERT OR IGNORE INTO categorias (nome) VALUES (?)'
);

categorias.forEach(cat => {
    stmtCat.run(cat.nome);
});

// Inserir produtos (com categoria_id!)
const produtos = [
    { id: 1, nome: "Anne Frank", preco: 50, estoque: 30, categoria_id: 1 },
    { id: 2, nome: "Entendendo Algoritmos", preco: 39, estoque: 50, categoria_id: 2 },
    { id: 3, nome: "Diário de uma banana", preco: 45, estoque: 45, categoria_id: 3 },
    { id: 4, nome: "Clean Code", preco: 60, estoque: 25, categoria_id: 4 },
    { id: 5, nome: "Dom Casmurro", preco: 35, estoque: 40, categoria_id: 5 },
    { id: 6, nome: "O Hobbit", preco: 55, estoque: 20, categoria_id: 6 },
    { id: 7, nome: "1984", preco: 48, estoque: 32, categoria_id: 7 },
    { id: 8, nome: "A Revolução dos Bichos", preco: 30, estoque: 28, categoria_id: 7 },
    { id: 9, nome: "JavaScript: O Guia Definitivo", preco: 70, estoque: 15, categoria_id: 4 },
    { id: 10, nome: "Pai Rico, Pai Pobre", preco: 42, estoque: 38, categoria_id: 8 },
    { id: 11, nome: "Harry Potter", preco: 52, estoque: 18, categoria_id: 6 },
    { id: 12, nome: "O Senhor dos Anéis", preco: 80, estoque: 12, categoria_id: 6 },
    { id: 13, nome: "Percy Jackson", preco: 44, estoque: 20, categoria_id: 6 },
    { id: 14, nome: "Código Limpo", preco: 58, estoque: 16, categoria_id: 4 },
    { id: 15, nome: "Algoritmos", preco: 65, estoque: 10, categoria_id: 2 },
    { id: 16, nome: "Sherlock Holmes", preco: 37, estoque: 24, categoria_id: 9 },
    { id: 17, nome: "A Culpa é das Estrelas", preco: 40, estoque: 22, categoria_id: 10 },
    { id: 18, nome: "It: A Coisa", preco: 62, estoque: 8, categoria_id: 11 },
    { id: 19, nome: "Drácula", preco: 33, estoque: 14, categoria_id: 11 },
    { id: 20, nome: "Mindset", preco: 47, estoque: 19, categoria_id: 12 }
];

//Inserindo dados usuários
const usuarios = [
    { id: 1, nome: "João Silva", email: "joao@gmail.com", senha: "123456" },
    { id: 2, nome: "Maria Oliveira", email: "maria@gmail.com", senha: "654321" }
];

const stmtUser = db.prepare(
    'INSERT OR IGNORE INTO usuarios (nome, email, senha) VALUES (?, ?, ?)'
);
const stmtProd = db.prepare(
    'INSERT OR IGNORE INTO produtos (nome, preco, estoque, categoria_id) VALUES (?, ?, ?, ?)'
);

usuarios.forEach(u => {
    stmtUser.run(u.nome, u.email, u.senha);
});

produtos.forEach(p => {
    stmtProd.run(p.nome, p.preco, p.estoque, p.categoria_id);
});

console.log('✅ Dados iniciais inseridos!');

const dados = db.prepare(`
    SELECT p.id, p.nome, p.preco, p.estoque, c.nome AS categoria
    FROM produtos p
    JOIN categorias c ON p.categoria_id = c.id
`).all();

console.log(dados);
module.exports = db;