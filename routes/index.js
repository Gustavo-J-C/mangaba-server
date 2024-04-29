const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Bem-vindo à API do seu projeto!');
});

module.exports = router;
