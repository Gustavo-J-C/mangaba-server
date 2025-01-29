const express = require('express');
const router = express.Router();
const PeriodosController = require('../controllers/periodosController');

// Rota para listar todos os períodos
router.get('/', PeriodosController.listar);

// Rota para buscar período por ID
router.get('/:id', PeriodosController.buscarPorId);

// Rota para criar novo período
router.post('/', PeriodosController.criar);

// Rota para atualizar um período existente
router.put('/:id', PeriodosController.atualizar);

// Rota para deletar um período
router.delete('/:id', PeriodosController.deletar);

module.exports = router;
