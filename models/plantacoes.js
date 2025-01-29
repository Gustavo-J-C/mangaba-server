const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Usuario = require('./usuarios');
const Fazenda = require('./fazendas');

const Plantacao = sequelize.define('plantacoes', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  fazenda_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Fazenda,
      key: 'id',
    },
  },
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  ds_nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ds_descricao: {
    type: DataTypes.TEXT,
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
  tableName: 'plantacoes'
});

module.exports = Plantacao;
