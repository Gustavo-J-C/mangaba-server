const express = require('express');
const router = express.Router();
const arvoresController = require('../controllers/arvoresController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', arvoresController.list);
router.post('/', authenticateToken,arvoresController.create);
router.get('/:id', arvoresController.getArvore);
router.put('/:id', authenticateToken, arvoresController.update);
router.delete('/:id', authenticateToken, arvoresController.delete);

router.get('/:id/qrcode', arvoresController.getQRCode);
router.get('/plantacao/:plantacaoId', arvoresController.getArvoresPorPlantacao);

module.exports = router;
