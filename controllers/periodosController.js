const Periodo = require('../models/periodos');
const Plantacao = require('../models/plantacoes');

const PeriodosController = {
  // Listar todos os períodos
  listar: async (req, res) => {
    try {
      const periodos = await Periodo.findAll({
        include: [{
          model: Plantacao,
          as: 'plantacao',  // Nome do relacionamento
          attributes: ['id', 'nome']  // Ajuste as colunas conforme necessário
        }]
      });
      res.status(200).json(periodos);
    } catch (error) {
      console.error('Erro ao listar períodos:', error);
      res.status(500).json({ error: 'Erro ao listar períodos' });
    }
  },

  // Buscar período por ID
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const periodo = await Periodo.findByPk(id, {
        include: [{
          model: Plantacao,
          as: 'plantacao',
          attributes: ['id', 'nome']  // Ajuste as colunas conforme necessário
        }]
      });

      if (!periodo) {
        return res.status(404).json({ error: 'Período não encontrado' });
      }
      res.status(200).json(periodo);
    } catch (error) {
      console.error('Erro ao buscar período:', error);
      res.status(500).json({ error: 'Erro ao buscar período' });
    }
  },

  // Criar novo período
  criar: async (req, res) => {
    try {
      const { plantacoes_id, tipo, dt_inicio, dt_fim } = req.body;

      // Criar novo período
      const novoPeriodo = await Periodo.create({ plantacoes_id, tipo, dt_inicio, dt_fim });
      res.status(201).json(novoPeriodo);
    } catch (error) {
      console.error('Erro ao criar período:', error);
      res.status(500).json({ error: 'Erro ao criar período' });
    }
  },

  // Atualizar período
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { plantacoes_id, tipo, dt_inicio, dt_fim } = req.body;

      const periodo = await Periodo.findByPk(id);
      if (!periodo) {
        return res.status(404).json({ error: 'Período não encontrado' });
      }

      // Atualizar o período
      await periodo.update({ plantacoes_id, tipo, dt_inicio, dt_fim });
      res.status(200).json(periodo);
    } catch (error) {
      console.error('Erro ao atualizar período:', error);
      res.status(500).json({ error: 'Erro ao atualizar período' });
    }
  },

  // Deletar período (exclusão lógica)
  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      const periodo = await Periodo.findByPk(id);
      if (!periodo) {
        return res.status(404).json({ error: 'Período não encontrado' });
      }

      // Exclusão lógica (paranoid: true)
      await periodo.destroy();
      res.status(200).json({ message: 'Período deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar período:', error);
      res.status(500).json({ error: 'Erro ao deletar período' });
    }
  }
};

module.exports = PeriodosController;
