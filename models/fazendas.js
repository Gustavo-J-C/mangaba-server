const { DataTypes } = require('sequelize');
const sequelize = require('../database');


const Fazenda = sequelize.define('fazendas', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  localizacao: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: true
  },
  area_total: {
    type: DataTypes.BIGINT,
    allowNull: true
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
  tableName: 'fazendas'
});

module.exports = Fazenda;
