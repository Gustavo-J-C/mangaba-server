const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Pega sua instância do sequelize
const Usuario = require('./usuarios');    // Importa o model de Usuário

const DeviceToken = sequelize.define('device_tokens', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: { // Chave estrangeira para 'usuarios'
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Usuario, // Referencia o model importado
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING(255), // Um token pode ser longo
    allowNull: false,
    unique: true // Garante que o mesmo token não seja salvo 2x
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
  timestamps: false,  // Seus timestamps são definidos manualmente
  paranoid: true,     // Para usar o 'deleted_at' (soft delete)
  underscored: true,  // Garante o padrão snake_case (ex: usuario_id)
  tableName: 'device_tokens' // Nome exato da tabela no banco
});

module.exports = DeviceToken;