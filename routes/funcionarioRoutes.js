const express = require('express');
const router = express.Router();
const FuncionariosController = require('../controllers/funcionariosController');

// Listar todos os funcionários
router.get('/', FuncionariosController.listar);

// Buscar um funcionário pelo ID
router.get('/:id', FuncionariosController.buscarPorId);

// Criar um novo funcionário
router.post('/', FuncionariosController.criar);

// Atualizar um funcionário
router.put('/:id', FuncionariosController.atualizar);

// Deletar um funcionário (exclusão lógica)
router.delete('/:id', FuncionariosController.deletar);

module.exports = router;
