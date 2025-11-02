require('dotenv').config();
const express = require('express');

const router = express.Router();

const autenticacaoController = require('../controllers/autenticacaoController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/login', autenticacaoController.login);

router.post('/registro', autenticacaoController.registro);

router.post('/redefinir-senha', autenticacaoController.resetarSenha);
router.post('/solicitar-redefinicao-senha', autenticacaoController.solicitarRedefinicaoSenha);
router.post('/verificar-codigo', autenticacaoController.validarCodigoVerificacao);

router.post('/refresh-token', autenticacaoController.refreshToken)

router.post("/verify-token", autenticacaoController.verifyToken);

router.put('/perfil/editar', authenticateToken, autenticacaoController.editarPerfil);

module.exports = router;