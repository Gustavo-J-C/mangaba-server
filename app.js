require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const express = require('express');
const usuariosRoutes = require('./routes/usuariosRoutes');
const plantacoesRoutes = require('./routes/plantacoesRoutes');
const arvoresRoutes = require('./routes/arvoresRoutes');
const fazendasRoutes = require('./routes/fazendaRoutes');
const extracoesRoutes = require('./routes/extracoesRoutes');
const autenticacaoRoutes = require('./routes/autenticacaoRouter');
const pushRoutes = require('./routes/pushRoutes');
const sequelize = require('./database');
const morgan = require('morgan');
const { iniciarScheduler } = require('./services/notificationScheduler');
const manutencaoRoutes = require('./routes/manutencaoRoutes');

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
app.use('/fazendas', fazendasRoutes);
app.use('/autenticacao', autenticacaoRoutes);
app.use('/push', pushRoutes);
app.use('/api/manutencao', manutencaoRoutes);


// Testar a conexão ao banco e iniciar o servidor
sequelize
  .authenticate()
  .then(() => {
    console.info('Conexão bem-sucedida com o banco de dados');
    iniciarScheduler();
    // Iniciar o servidor
    app.listen(PORT, () => {
      console.info(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o MySQL REMOTO (CloudClusters) estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ ERRO ao conectar com o MySQL REMOTO:', error.message);
        // Aqui é onde você receberia um erro se o Firewall estivesse bloqueando ou as credenciais erradas
    }
}

testConnection();

module.exports = sequelize;;