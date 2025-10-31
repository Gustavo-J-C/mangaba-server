const Arvore = require("./arvores");
const Extracao = require("./extracoes");
const Fazenda = require("./fazendas");
const Funcionario = require("./funcionarios");
const Periodo = require("./periodos");
const Plantacao = require("./plantacoes");
const Servico = require("./servicos");
const Usuario = require("./usuarios");
const DeviceToken = require("./deviceTokens"); 
const Manutencao = require("./manutencoes"); 

// --- ON DELETE CASCADE: Extracao e Manutencao dependem de Arvore ---
Extracao.belongsTo(Arvore, { foreignKey: 'arvores_id', as: 'arvore', onDelete: 'CASCADE' });

Arvore.hasMany(Extracao, { foreignKey: 'arvores_id', as: 'extracoes', onDelete: 'CASCADE' });
Arvore.belongsTo(Plantacao, { foreignKey: 'plantacoes_id', as: 'plantacao', onDelete: 'CASCADE' }); // Adicionado CASCADE para a relação BelongsTo

Fazenda.hasMany(Usuario, { foreignKey: 'fazenda_id', as: 'proprietarios' });
Fazenda.hasMany(Plantacao, { foreignKey: 'fazenda_id', as: 'plantacoes' });

Funcionario.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Funcionario.hasMany(Servico, { foreignKey: 'funcionario_id', as: 'servicos' });

Periodo.belongsTo(Plantacao, { foreignKey: 'plantacoes_id', as: 'plantacao' });

// --- ON DELETE CASCADE: Arvore depende de Plantacao ---
Plantacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'proprietario', onDelete: 'CASCADE' });
Plantacao.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda', onDelete: 'CASCADE' });
Plantacao.hasMany(Arvore, { foreignKey: 'plantacoes_id', as: 'arvores', onDelete: 'CASCADE' }); // Principal para deletar árvores

Servico.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Servico.belongsTo(Funcionario, { foreignKey: 'funcionario_id', as: 'responsavel' });

Usuario.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Usuario.hasMany(Plantacao, { foreignKey: 'usuario_id', as: 'plantacoes', onDelete: 'CASCADE' }); // Principal para deletar plantações

// --- Associações de Notificação ---
DeviceToken.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario', onDelete: 'CASCADE' });
Usuario.hasMany(DeviceToken, { foreignKey: 'usuario_id', as: 'device_tokens', onDelete: 'CASCADE' });

Manutencao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario', onDelete: 'CASCADE' });
Usuario.hasMany(Manutencao, { foreignKey: 'usuario_id', as: 'manutencoes', onDelete: 'CASCADE' });

// Associação Manutencao <-> Arvore
Manutencao.belongsTo(Arvore, { foreignKey: 'arvores_id', as: 'arvoreParaManutencao', onDelete: 'CASCADE' });
Arvore.hasMany(Manutencao, { foreignKey: 'arvores_id', as: 'manutencoes', onDelete: 'CASCADE' });

// 3. Exporta todos os models
module.exports = {
  Arvore,
  Extracao,
  Fazenda,
  Funcionario,
  Periodo,
  Plantacao,
  Servico,
  Usuario,
  DeviceToken, 
  Manutencao,  
};
