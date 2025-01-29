const Servico = require('../models/servicos');
const Fazenda = require('../models/fazendas');
const Funcionario = require('../models/funcionarios');

const ServicosController = {
  // Listar todos os serviços
  listar: async (req, res) => {
    try {
      const servicos = await Servico.findAll({
        include: [
          {
            model: Fazenda,
            as: 'fazenda',
            attributes: ['id', 'nome']  // Ajuste conforme os campos necessários
          },
          {
            model: Funcionario,
            as: 'funcionario',
            attributes: ['id', 'nome']  // Ajuste conforme os campos necessários
          }
        ]
      });
      res.status(200).json(servicos);
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      res.status(500).json({ error: 'Erro ao listar serviços' });
    }
  },

  // Buscar serviço por ID
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const servico = await Servico.findByPk(id, {
        include: [
          {
            model: Fazenda,
            as: 'fazenda',
            attributes: ['id', 'nome']
          },
          {
            model: Funcionario,
            as: 'funcionario',
            attributes: ['id', 'nome']
          }
        ]
      });

      if (!servico) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }
      res.status(200).json(servico);
    } catch (error) {
      console.error('Erro ao buscar serviço:', error);
      res.status(500).json({ error: 'Erro ao buscar serviço' });
    }
  },

  // Criar novo serviço
  criar: async (req, res) => {
    try {
      const { descricao, custo, data_execucao, fazenda_id, funcionario_id } = req.body;

      const novoServico = await Servico.create({ descricao, custo, data_execucao, fazenda_id, funcionario_id });
      res.status(201).json(novoServico);
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      res.status(500).json({ error: 'Erro ao criar serviço' });
    }
  },

  // Atualizar serviço
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { descricao, custo, data_execucao, fazenda_id, funcionario_id } = req.body;

      const servico = await Servico.findByPk(id);
      if (!servico) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }

      await servico.update({ descricao, custo, data_execucao, fazenda_id, funcionario_id });
      res.status(200).json(servico);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
  },

  // Deletar serviço (exclusão lógica)
  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      const servico = await Servico.findByPk(id);
      if (!servico) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }

      await servico.destroy();
      res.status(200).json({ message: 'Serviço deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      res.status(500).json({ error: 'Erro ao deletar serviço' });
    }
  }
};

module.exports = ServicosController;
