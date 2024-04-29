const express = require('express');
const router = express.Router();
const indexRouter = require('./index');
const usuariosRouter = require('./usuariosRoutes');
const plantacoesRouter = require('./plantacoesRoutes');
const arvoresRouter = require('./arvoresRoutes');
const extracoesRouter = require('./extracoesRoutes');
const autenticacaoRouter = require('./autenticacaoRouter');

router.use('/', indexRouter);
router.use('/usuarios', usuariosRouter);
router.use('/plantacoes', plantacoesRouter);
router.use('/arvores', arvoresRouter);
router.use('/extracoes', extracoesRouter);
router.use('/autenticacao', autenticacaoRouter);

module.exports = router;
