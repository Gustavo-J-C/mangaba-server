const Plantacao = require('../models/plantacoes');

const plantacoesController = {
  list: async (req, res) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const { limit = 10, offset = 0 } = req.query;
      const plantacoes = await Plantacao.findAll({
        where: { usuarios_id: userId },
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      return res.json(plantacoes);
    } catch (error) {
      console.error('Erro ao listar plantações:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  create: async (req, res) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const { ds_nome, ds_descricao } = req.body;
      if (!ds_nome || !ds_descricao) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }
      const plantacao = await Plantacao.create({ usuarios_id: userId, ds_nome, ds_descricao });
      res.status(201).json(plantacao);
    } catch (error) {
      console.error('Erro ao criar plantação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { ds_nome, ds_descricao } = req.body;
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const [updated] = await Plantacao.update({ ds_nome, ds_descricao }, {
        where: { id, usuarios_id: userId }
      });
      if (updated) {
        res.status(200).json({ message: 'Plantação atualizada com sucesso' });
      } else {
        res.status(404).json({ error: 'Plantação não encontrada ou não pertence ao usuário' });
      }
    } catch (error) {
      console.error('Erro ao atualizar plantação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const deleted = await Plantacao.destroy({ where: { id, usuarios_id: userId } });
      if (deleted) {
        res.status(204).json({ message: 'Plantação excluída com sucesso' });
      } else {
        res.status(404).json({ error: 'Plantação não encontrada ou não pertence ao usuário' });
      }
    } catch (error) {
      console.error('Erro ao excluir plantação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = plantacoesController;
