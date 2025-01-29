const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Fazenda = require('./fazendas');

const Funcionario = sequelize.define('funcionarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: 'funcionarios'
});


module.exports = Funcionario;
