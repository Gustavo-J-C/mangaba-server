const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Plantacao = require('./plantacoes');

const Arvore = sequelize.define('arvores', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  plantacoes_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Plantacao,
      key: 'id'
    }
  },
  ds_nome: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  ds_descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  localizacao: {
    type: DataTypes.GEOMETRY('POINT'),
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
  tableName: 'arvores'
});

module.exports = Arvore;
