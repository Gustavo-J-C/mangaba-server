const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Usuario = require('./usuarios');
const Arvore = require('./arvores'); 

const Manutencao = sequelize.define('manutencoes', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: { 
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  arvores_id: { 
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Arvore, 
      key: 'id'
    }
  },
  data_extracao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_notificacao: { 
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDENTE', 'ENVIADA', 'CONCLUIDA'),
    allowNull: false,
    defaultValue: 'PENDENTE'
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
  tableName: 'manutencoes'
});

module.exports = Manutencao;