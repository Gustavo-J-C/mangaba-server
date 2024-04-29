const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verifique se o token é válido
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token expired or invalid' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
