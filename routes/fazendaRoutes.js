const express = require('express');
const router = express.Router();
const FazendasController = require('../controllers/fazendasController');


// Listar todas as fazendas
router.get('/', FazendasController.listar);

// Buscar fazenda por ID
router.get('/:id', FazendasController.buscarPorId);

// Criar uma nova fazenda
router.post('/', FazendasController.criar);

// Atualizar uma fazenda existente
router.put('/:id', FazendasController.atualizar);

// Deletar uma fazenda
router.delete('/:id', FazendasController.deletar);

module.exports = router;
