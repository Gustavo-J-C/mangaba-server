const express = require('express');
const router = express.Router();
const extracoesController = require('../controllers/extracoesController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/arvore/:arvores_id', extracoesController.findByArvore);
router.get('/', extracoesController.list);
router.get('/:id', extracoesController.findById);
router.post('/', authenticateToken, extracoesController.create);
router.patch('/:id', authenticateToken, extracoesController.update);
router.delete('/:id', authenticateToken, extracoesController.delete);

module.exports = router;
