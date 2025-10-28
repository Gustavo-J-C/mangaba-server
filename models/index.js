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

// 2. Define todas as associações
Extracao.belongsTo(Arvore, { foreignKey: 'arvores_id', as: 'arvore' }); // Deixa o seu original

Arvore.hasMany(Extracao, { foreignKey: 'arvores_id', as: 'extracoes' });
Arvore.belongsTo(Plantacao, { foreignKey: 'plantacoes_id', as: 'plantacao' });

Fazenda.hasMany(Usuario, { foreignKey: 'fazenda_id', as: 'proprietarios' });
Fazenda.hasMany(Plantacao, { foreignKey: 'fazenda_id', as: 'plantacoes' });

Funcionario.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Funcionario.hasMany(Servico, { foreignKey: 'funcionario_id', as: 'servicos' });

Periodo.belongsTo(Plantacao, { foreignKey: 'plantacoes_id', as: 'plantacao' });

Plantacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'proprietario' });
Plantacao.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Plantacao.hasMany(Arvore, { foreignKey: 'plantacoes_id', as: 'arvores' });

Servico.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Servico.belongsTo(Funcionario, { foreignKey: 'funcionario_id', as: 'responsavel' });

Usuario.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Usuario.hasMany(Plantacao, { foreignKey: 'usuario_id', as: 'plantacoes' });

// --- Associações de Notificação ---
DeviceToken.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(DeviceToken, { foreignKey: 'usuario_id', as: 'device_tokens' });

Manutencao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Manutencao, { foreignKey: 'usuario_id', as: 'manutencoes' });

// --- CORREÇÃO AQUI ---
// Dando um alias novo e único para esta associação
Manutencao.belongsTo(Arvore, { foreignKey: 'arvores_id', as: 'arvoreParaManutencao' }); 
Arvore.hasMany(Manutencao, { foreignKey: 'arvores_id', as: 'manutencoes' });
// --- Fim das Associações ---

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
