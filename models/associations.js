const Arvore = require("./arvores");
const Extracao = require("./extracoes");
const Fazenda = require("./fazendas");
const Funcionario = require("./funcionarios");
const Periodo = require("./periodos");
const Plantacao = require("./plantacoes");
const Servico = require("./servicos");
const Usuario = require("./usuarios");

Extracao.belongsTo(Arvore, { foreignKey: 'arvores_id', as: 'arvore' });

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

module.exports = {
    Arvore,
    Extracao,
    Fazenda,
    Funcionario,
    Periodo,
    Plantacao,
    Servico,
    Usuario,
};

