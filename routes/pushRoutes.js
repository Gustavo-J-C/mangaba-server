const express = require('express');
const router = express.Router();
const pushController = require('../controllers/pushController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para o app registrar o token de notificação
// POST /api/push/register
router.post('/register', authMiddleware, pushController.register);

module.exports = router;