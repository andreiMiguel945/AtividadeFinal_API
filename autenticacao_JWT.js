const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sua_chave_secreta_aqui'; // Na prática: process.env.JWT_SECRET

module.exports = function(app, db) {

// POST /auth/register
app.post('/auth/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // 1. Validações
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Campos obrigatórios' });
        }
        
        if (senha.length < 6) {
            return res.status(400).json({ erro: 'Senha mínimo 6 caracteres' });
        }
        
        // 2. Verificar se email já existe
        const usuarioExiste = db.prepare(
            'SELECT id FROM usuarios WHERE email = ?'
        ).get(email);
        
        if (usuarioExiste) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }
        
        // 3. Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        
        // 4. Inserir usuário
           db.prepare(`
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
    `).run(nome, email, senhaHash);
        const userId = db.lastID; // ID do usuário recém-criado
      
        res.status(201).json({ mensagem: "Usuário criado" });
        // 5. Gerar token JWT
        const token = jwt.sign(
            { userId, email }, // payload
            JWT_SECRET,                // secret
            { expiresIn: '24h' }     // expira em 24h
        );
        
        // 6. Retornar token + dados (SEM senha!)
        res.status(201).json({
            mensagem: 'Usuário criado com sucesso',
            token,
            usuario: { id: userId, nome, email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // 1. Validações
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha obrigatórios' });
        }
        
        // 2. Buscar usuário por email
        const usuario = db.prepare(
            'SELECT * FROM usuarios WHERE email = ?'
        ).get(email);
        
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        // 3. Comparar senhas
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        // 4. Gerar token JWT
        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email, role: usuario.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // 5. Retornar token + dados (SEM senha!)
        res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro no login' });
    }
    function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não enviado' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token inválido' });
    }

    jwt.verify(token, JWT_SECRET, (erro, usuario) => {
        if (erro) {
            return res.status(403).json({ erro: 'Token inválido ou expirado' });
        }

        req.usuario = usuario;
        next();
    });
}
module.exports = { autenticar, verificarToken };

});};