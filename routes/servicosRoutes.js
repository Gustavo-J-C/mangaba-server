const express = require('express');
const router = express.Router();
const ServicosController = require('../controllers/servicosController');

// Rota para listar todos os serviços
router.get('/', ServicosController.listar);

// Rota para buscar serviço por ID
router.get('/:id', ServicosController.buscarPorId);

// Rota para criar novo serviço
router.post('/', ServicosController.criar);

// Rota para atualizar um serviço existente
router.put('/:id', ServicosController.atualizar);

// Rota para deletar um serviço
router.delete('/:id', ServicosController.deletar);

module.exports = router;
