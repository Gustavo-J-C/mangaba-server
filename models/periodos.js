const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Plantacao = require('./plantacoes');

const Periodo = sequelize.define('periodos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plantacoes_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plantacao,
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  dt_inicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dt_fim: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: 'periodos'
});


module.exports = Periodo;
