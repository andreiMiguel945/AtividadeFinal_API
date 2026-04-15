const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sua_chave';

// FUNÇÃO PRINCIPAL
function autenticar(app, db) {

    app.post('/auth/register', async (req, res) => {
        res.json({ mensagem: "register ok" });
    });

    app.post('/auth/login', async (req, res) => {
        res.json({ mensagem: "login ok" });
    });

}

// MIDDLEWARE TOKEN
function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não enviado" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (erro, decoded) => {
        if (erro) {
            return res.status(403).json({ erro: "Token inválido" });
        }

        req.usuario = decoded;
        next();
    });
}

module.exports = {
    autenticar,
    verificarToken
};