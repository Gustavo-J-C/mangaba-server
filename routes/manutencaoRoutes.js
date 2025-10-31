const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');
const authenticateToken = require('../middlewares/authMiddleware'); // Use seu middleware de autenticação

// Rota para buscar todas as manutenções de uma árvore específica
// GET /api/manutencao/arvore/:arvores_id
router.get('/arvore/:arvores_id', authenticateToken, manutencaoController.listByArvore);

// Rota para marcar uma manutenção como CONCLUIDA
// PUT /api/manutencao/:id/concluir
router.put('/:id/concluir', authenticateToken, manutencaoController.concluirManutencao);

module.exports = router;
