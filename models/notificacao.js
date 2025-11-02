const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Usuario = require('./usuarios');
const Arvore = require('./arvores'); // --- ADICIONE A IMPORTAÇÃO DA ARVORE ---


const Notificacao = sequelize.define('Notificacao', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tipo: {
    type: DataTypes.ENUM('MANUTENCAO', 'AVISO'),
    defaultValue: 'AVISO',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  arvore_id: {
    type: DataTypes.BIGINT, // Tem que ser o mesmo tipo do ID da árvore
    allowNull: true,
    references: {
      model: Arvore,
      key: 'id',
    }
  },
}, {
  tableName: 'notificacoes',
  timestamps: true,

  underscored: true, // Isso resolve o problema
  paranoid: true,
});

Notificacao.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Notificacao, { foreignKey: 'usuario_id' });

Notificacao.belongsTo(Arvore, { foreignKey: 'arvore_id' });

module.exports = Notificacao;