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
  dt_plantio: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isBefore: new Date().toISOString(), // Garante que a data não seja futura
    }
  },
  status: {
    type: DataTypes.ENUM('Plantada', 'Vingou', 'Não Vingou', 'Produzindo'),
    allowNull: true
  },
  localizacao: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },
  qt_extracoes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  vl_total_extracoes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  md_frutos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
   md_tempo_extracoes: {
    type: DataTypes.FLOAT, // Armazena a média em dias
    allowNull: true,
    defaultValue: null,
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
