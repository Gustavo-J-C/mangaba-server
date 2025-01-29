const Funcionario = require('../models/funcionarios');
const Fazenda = require('../models/fazendas');

const FuncionariosController = {
  // Listar todos os funcionários
  listar: async (req, res) => {
    try {
      // Verifica se o parâmetro 'includeFazenda' foi passado e é 'true'
      const includeFazenda = req.query.includeFazenda === 'true';

      const funcionarios = await Funcionario.findAll({
        // Inclui a Fazenda condicionalmente
        include: includeFazenda
          ? [{
              model: Fazenda,
              as: 'fazenda',
              attributes: ['id', 'nome'],  // Ajuste conforme as colunas da Fazenda
          }]
          : []
      });

      res.status(200).json(funcionarios);
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      res.status(500).json({ error: 'Erro ao listar funcionários' });
    }
  },

  // Buscar funcionário por ID
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;

      // Verifica se o parâmetro 'includeFazenda' foi passado e é 'true'
      const includeFazenda = req.query.includeFazenda === 'true';

      const funcionario = await Funcionario.findByPk(id, {
        include: includeFazenda
          ? [{
              model: Fazenda,
              as: 'fazenda',
              attributes: ['id', 'nome'],  // Ajuste conforme as colunas da Fazenda
          }]
          : []
      });

      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }
      res.status(200).json(funcionario);
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }
  },

  // Criar um novo funcionário
  criar: async (req, res) => {
    try {
      const { nome, cargo, salario, fazenda_id } = req.body;

      const novaFazenda = await Funcionario.create({ nome, cargo, salario, fazenda_id });
      res.status(201).json(novaFazenda);
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
  },

  // Atualizar um funcionário
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, cargo, salario, fazenda_id } = req.body;

      const funcionario = await Funcionario.findByPk(id);
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      await funcionario.update({ nome, cargo, salario, fazenda_id });
      res.status(200).json(funcionario);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
  },

  // Deletar um funcionário
  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      const funcionario = await Funcionario.findByPk(id);
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      await funcionario.destroy();  // Exclusão lógica devido ao `paranoid: true`
      res.status(200).json({ message: 'Funcionário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      res.status(500).json({ error: 'Erro ao deletar funcionário' });
    }
  }
};

module.exports = FuncionariosController;