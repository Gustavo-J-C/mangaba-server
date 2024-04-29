const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  ds_tipo_documento: {
    type: DataTypes.ENUM('CPF', 'CNPJ'),
    allowNull: false
  },
  nu_documento: {
    type: DataTypes.STRING(14),
    allowNull: false
  },
  ds_nome_completo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ds_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  ds_senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  codigo_verificacao: {
    type: DataTypes.STRING(6),
    allowNull: true
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
  tableName: 'usuarios'
});

module.exports = Usuario;
