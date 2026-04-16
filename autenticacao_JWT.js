const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// IMPORTANTE: Use a mesma chave que está no seu .env ou index.js
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave';

// FUNÇÃO PARA CONFIGURAR AS ROTAS DE LOGIN E REGISTRO
function autenticar(app, db) {

    // Rota de Registro
    app.post('/auth/register', async (req, res) => {
        const { nome, email, senha } = req.body;
        try {
            // Insere o novo usuário no banco de dados
            const stmt = db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
            stmt.run(nome, email, senha);
            res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
        } catch (error) {
            res.status(400).json({ erro: "E-mail já existe ou erro no cadastro." });
        }
    });

    // Rota de Login (Aqui é onde você "descobre" seu token)
    app.post('/auth/login', (req, res) => {
        const { email, senha } = req.body;

        // 1. Busca o usuário no banco pelo e-mail
        const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

        // 2. Verifica se o usuário existe e se a senha está correta
        if (user && user.senha === senha) {
            // 3. Gera o Token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email }, 
                JWT_SECRET, 
                { expiresIn: '2h' } // O token vale por 2 horas
            );

            // 4. Retorna o token para você usar
            return res.json({ 
                mensagem: "Login realizado!",
                token: token 
            });
        }

        // Se errar a senha ou e-mail
        res.status(401).json({ erro: "E-mail ou senha inválidos" });
    });

}

// MIDDLEWARE PARA PROTEGER AS OUTRAS ROTAS (GET, POST de produtos, etc)
function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não enviado" });
    }

    // O formato geralmente é "Bearer TOKEN_AQUI", por isso usamos o split
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: "Token mal formatado" });
    }

    jwt.verify(token, JWT_SECRET, (erro, decoded) => {
        if (erro) {
            return res.status(403).json({ erro: "Token inválido ou expirado" });
        }

        // Salva os dados do dono do token para a próxima função usar
        req.usuario = decoded;
        next();
    });
}

module.exports = {
    autenticar,
    verificarToken
};