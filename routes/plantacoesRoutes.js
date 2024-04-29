const express = require('express');
const router = express.Router();
const plantacoesController = require('../controllers/plantacoesController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, plantacoesController.list);
router.post('/', authenticateToken, plantacoesController.create);
router.put('/:id', authenticateToken, plantacoesController.update);
router.delete('/:id', authenticateToken, plantacoesController.delete);

module.exports = router;
