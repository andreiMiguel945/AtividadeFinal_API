// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sua_chave_secreta';

function autenticar(req, res, next) {
    // 1. Pegar token do header Authorization
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }
    
    // 2. Formato esperado: "Bearer eyJhbGci..."
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
        return res.status(401).json({ erro: 'Token mal formatado' });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ erro: 'Token mal formatado' });
    }
    
    // 3. Verificar e decodificar token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: 'Token inválido ou expirado' });
        }
        
        // 4. Adicionar userId ao req para uso nas rotas
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        
        // 5. Continuar para próximo middleware/rota
        next();
    });
}

module.exports = autenticar;