const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

  // 1. Pega o cabeçalho 'Authorization'
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // 2. --- ESTA É A ÚNICA CORREÇÃO ---
  // Separa a palavra "Bearer" do token
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token mal formatado' });
  }

  // 3. Pega *apenas* o token
  const token = parts[1];
  
  // 4. Verifica o token (com a sua lógica original)
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      // O 'refresh-token' vai cuidar de erros 403, então está certo
      return res.status(403).json({ message: 'Token expired or invalid' });
    } 
    
    // 5. --- MANTIDO EXATAMENTE COMO O SEU ORIGINAL ---
    // Salva o payload (ex: { userId: 26, iat: ... }) em 'req.user'
    req.user = user; 
    
    next();
  });
}

module.exports = authenticateToken;

