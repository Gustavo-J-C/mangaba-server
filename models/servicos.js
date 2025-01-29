const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Fazenda = require('./fazendas');
const Funcionario = require('./funcionarios');

const Servico = sequelize.define('servicos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  custo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_execucao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fazenda_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Fazenda,
      key: 'id'
    }
  },
  funcionario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Funcionario,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false,
  paranoid: true,
  underscored: true,
  tableName: 'servicos'
});

module.exports = Servico;
