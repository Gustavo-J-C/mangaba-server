const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Arvore = require('./arvores');

const Extracao = sequelize.define('extracoes', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  arvores_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Arvore,
      key: 'id'
    }
  },
  vl_volume: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: false,
  paranoid: true,
  underscored: true,
  tableName: 'extracoes'
});

Extracao.beforeUpdate(async (extracao, options) => {
  extracao.updated_at = new Date();
});

module.exports = Extracao;
