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
      model: 'arvores',
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
  paranoid: true,
  underscored: true,
  tableName: 'extracoes'
});

// =============================================
// FUNÇÕES UTILITÁRIAS
// =============================================

/**
 * Atualiza a quantidade total de extrações de uma árvore
 * @param {number} arvores_id - ID da árvore
 */
async function atualizarQtExtracoes(arvores_id) {
  const total = await Extracao.count({ where: { arvores_id } });
  console.log(`Atualizando qt_extracoes para árvore ID ${arvores_id}: ${total}`);
  
  // Importação tardia para evitar dependência circular
  const Arvore = require('./arvores');
  await Arvore.update(
    { qt_extracoes: total },
    { where: { id: arvores_id } }
  );
}

/**
 * Recalcula a média de tempo entre extrações de uma árvore
 * @param {number} arvores_id - ID da árvore
 */
async function recalcularMediaTempoExtracoes(arvores_id) {
  const extracoes = await Extracao.findAll({
    where: { arvores_id, deleted_at: null },
    order: [['created_at', 'ASC']],
  });

  // Importação tardia para evitar dependência circular
  const Arvore = require('./arvores');

  // Se não há extrações suficientes para calcular média
  if (extracoes.length <= 1) {
    await Arvore.update(
      { md_tempo_extracoes: null },
      { where: { id: arvores_id } }
    );
    return;
  }

  // Calcula as diferenças entre extrações consecutivas
  let vl_total_extracoes = 0;
  const diferencasEmMs = [];
  for (let i = 0; i < extracoes.length; i++) {
    vl_total_extracoes += extracoes[i].vl_volume;
    console.log(`Vl_volume extração ${i}: ${extracoes[i].vl_volume}`);
    
    const diff = new Date(extracoes[i].created_at) - new Date(extracoes[i].created_at);
    diferencasEmMs.push(diff);
  }

  console.log(`Quantidade de extracoes: ${extracoes.length}, total volume: ${vl_total_extracoes}`);

  // Converte para dias e calcula a média
  const mediaMs = diferencasEmMs.reduce((acc, curr) => acc + curr, 0) / diferencasEmMs.length;
  const mediaDias = mediaMs / (1000 * 60 * 60 * 24);

  await Arvore.update(
    { md_tempo_extracoes: Math.round(mediaDias * 100) / 100,
      vl_total_extracoes,
      md_frutos: Math.round((vl_total_extracoes / extracoes.length) * 100) / 100
     }, // Arredonda para 2 casas decimais
    { where: { id: arvores_id } }
  );
}


/**
 * Executa todos os recálculos necessários após mudança em extrações
 * @param {number} arvores_id - ID da árvore
 */
async function recalcularEstatisticasArvore(arvores_id) {
  try {
    await Promise.all([
      atualizarQtExtracoes(arvores_id),
      recalcularMediaTempoExtracoes(arvores_id)
    ]);
    console.log(`✅ Estatísticas da árvore ${arvores_id} atualizadas com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao recalcular estatísticas da árvore ${arvores_id}:`, error);
    throw error;
  }
}

// =============================================
// HOOKS DO SEQUELIZE
// =============================================

Extracao.beforeDestroy(async (extracao, options) => {
  console.log('🔍 beforeDestroy disparado:', {
    id: extracao.id,
    arvores_id: extracao.arvores_id,
    force: options.force,
    paranoid: options.paranoid
  });
});

// Atualiza timestamp antes de modificar
Extracao.beforeUpdate(async (extracao, options) => {
  extracao.updated_at = new Date();
});

// Recalcula estatísticas após criar extração
Extracao.afterCreate(async (extracao, options) => {
  console.log(`🌱 Nova extração criada para árvore ${extracao.arvores_id}`);
  await recalcularEstatisticasArvore(extracao.arvores_id);
});

// Recalcula estatísticas após remover extração
Extracao.afterDestroy(async (extracao, options) => {
  console.log(`🗑️ Extração removida da árvore ${extracao.arvores_id}`);
  await recalcularEstatisticasArvore(extracao.arvores_id);
});

// Recalcula estatísticas após atualizar extração (caso mude a árvore)
Extracao.afterUpdate(async (extracao, options) => {
  if (extracao.changed('arvores_id')) {
    console.log(`🔄 Extração movida para árvore ${extracao.arvores_id}`);
    await recalcularEstatisticasArvore(extracao.arvores_id);
    
    // Se mudou de árvore, precisa recalcular a árvore anterior também
    if (extracao._previousDataValues && extracao._previousDataValues.arvores_id) {
      await recalcularEstatisticasArvore(extracao._previousDataValues.arvores_id);
    }
  }
});

module.exports = Extracao;
