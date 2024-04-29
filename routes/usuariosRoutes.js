const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', usuariosController.list);
router.post('/', usuariosController.create);
router.put('/:id', authenticateToken, usuariosController.update);
router.delete('/:id', authenticateToken, usuariosController.delete);

module.exports = router;
