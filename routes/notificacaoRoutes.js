const express = require('express');
const router = express.Router();
const notificacaoController = require('../controllers/notificacaoController');
const authMiddleware = require('../middlewares/authMiddleware');


// GET 
router.get('/', authMiddleware, notificacaoController.list);

// PUT
router.put('/:id/lida', authMiddleware, notificacaoController.markAsRead);

// DELETE
router.delete('/:id', authMiddleware, notificacaoController.delete);

module.exports = router;