const Plantacao = require('../models/plantacoes');
const Fazenda = require('../models/fazendas');

const plantacoesController = {
  list: async (req, res) => {
    try {
      const { fazenda_id } = req.params;

      const { limit = 10, offset = 0 } = req.query;

      const whereCondition = {};
      if (fazenda_id) {
        whereCondition.fazenda_id = fazenda_id;
      }

      const plantacoes = await Plantacao.findAll({
        where: whereCondition,
        include: [
          {
            model: Fazenda,
            as: 'fazenda',
            attributes: ['id', 'nome'], // Ajuste conforme os atributos desejados
          },
        ],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
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

      const { fazenda_id, ds_nome, ds_descricao } = req.body;
      if (!fazenda_id || !ds_nome || !ds_descricao) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const plantacao = await Plantacao.create({
        usuario_id: userId,
        fazenda_id,
        ds_nome,
        ds_descricao,
      });

      res.status(201).json(plantacao);
    } catch (error) {
      console.error('Erro ao criar plantação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { fazenda_id, ds_nome, ds_descricao } = req.body;

    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const [updated] = await Plantacao.update(
        { fazenda_id, ds_nome, ds_descricao },
        { where: { id, usuario_id: userId, deleted_at: null } }
      );

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

      const deleted = await Plantacao.update(
        { deleted_at: new Date() },
        { where: { id, usuario_id: userId, deleted_at: null } }
      );

      if (deleted[0]) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Plantação não encontrada ou não pertence ao usuário' });
      }
    } catch (error) {
      console.error('Erro ao excluir plantação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
};

module.exports = plantacoesController;
