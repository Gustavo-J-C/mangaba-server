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

async function recalcularMedia(arvores_id) {
  const extracoes = await Extracao.findAll({
    where: { arvores_id },
    order: [['created_at', 'ASC']],
  });

  if (extracoes.length <= 1) {
    await Arvore.update(
      { md_tempo_extracoes: null }, // Sem dados suficientes, define como null
      { where: { id: arvores_id } }
    );
    return;
  }

  const diffs = [];
  for (let i = 1; i < extracoes.length; i++) {
    const diff = new Date(extracoes[i].created_at) - new Date(extracoes[i - 1].created_at);
    diffs.push(diff);
  }

  const mediaMillis = diffs.reduce((acc, curr) => acc + curr, 0) / diffs.length;
  const mediaDias = mediaMillis / (1000 * 60 * 60 * 24);

  await Arvore.update(
    { md_tempo_extracoes: mediaDias },
    { where: { id: arvores_id } }
  );
}

// Hook para atualizar ao criar uma nova extração
Extracao.afterCreate(async (extracao) => {
  await recalcularMedia(extracao.arvores_id);
});

// Hook para atualizar ao remover uma extração
Extracao.afterDestroy(async (extracao) => {
  await recalcularMedia(extracao.arvores_id);
});

Extracao.beforeUpdate(async (extracao, options) => {
  extracao.updated_at = new Date();
});

module.exports = Extracao;
