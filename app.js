require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const express = require('express');
const usuariosRoutes = require('./routes/usuariosRoutes');
const plantacoesRoutes = require('./routes/plantacoesRoutes');
const arvoresRoutes = require('./routes/arvoresRoutes');
const extracoesRoutes = require('./routes/extracoesRoutes');
const autenticacaoRoutes = require('./routes/autenticacaoRouter');
const sequelize = require('./database');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(compression());

app.use(morgan('dev'));
app.use(express.json());

// Rotas
app.use('/usuarios', usuariosRoutes);
app.use('/plantacoes', plantacoesRoutes);
app.use('/arvores', arvoresRoutes);
app.use('/extracoes', extracoesRoutes);
app.use('/autenticacao', autenticacaoRoutes);

// Sincronizar modelos com o banco de dados
sequelize.sync({ force: false })
  .then(() => {
    console.info('Conexão bem-sucedida com o banco de dados');
    // Iniciar o servidor
    app.listen(PORT, () => {
      console.info(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
