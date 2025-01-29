const Arvore = require("./arvores");
const Extracao = require("./extracoes");
const Fazenda = require("./fazendas");
const Funcionario = require("./funcionarios");
const Periodo = require("./periodos");
const Plantacao = require("./plantacoes");
const Servico = require("./servicos");
const Usuario = require("./usuarios");

Arvore.hasMany(Extracao, { foreignKey: 'arvores_id', as: 'extracoes' });
Arvore.belongsTo(Plantacao, { foreignKey: 'plantacoes_id', as: 'plantacao' });

Fazenda.hasMany(Usuario, { foreignKey: 'fazenda_id', as: 'proprietarios' });
Fazenda.hasMany(Plantacao, { foreignKey: 'fazenda_id', as: 'plantacoes' });


// Adicionando relação belongsTo com Fazenda
Funcionario.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Funcionario.hasMany(Servico, { foreignKey: 'funcionario_id', as: 'servicos' });


Periodo.belongsTo(Plantacao, { foreignKey: 'plantacoes_id', as: 'plantacao' });

Plantacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'proprietario' });
Plantacao.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Plantacao.hasMany(Arvore, { foreignKey: 'plantacoes_id', as: 'arvores' });

// Adicionando relações
Servico.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });
Servico.belongsTo(Funcionario, { foreignKey: 'funcionario_id', as: 'responsavel' });

Usuario.belongsTo(Fazenda, { foreignKey: 'fazenda_id', as: 'fazenda' });