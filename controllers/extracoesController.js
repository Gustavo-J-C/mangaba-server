const Arvore = require('../models/arvores');
const Extracao = require('../models/extracoes');
const Plantacao = require('../models/plantacoes');
const Manutencao = require('../models/manutencoes');

const extracoesController = {
  list: async (req, res) => {
    try {
      const extracoes = await Extracao.findAll();
      res.json(extracoes);
    } catch (error) {
      console.error('Erro ao listar extrações:', error);
      res.status(500).json({ error: 'Erro ao listar extrações' });
    }
  },

  create: async (req, res) => {
    const { arvores_id, vl_volume } = req.body;
    const usuarioId = req.user && req.user.userId;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }
    try {
      // Encontrar a árvore
      const arvore = await Arvore.findByPk(arvores_id);

      if (!arvore) {
        return res.status(404).json({ error: 'Árvore não encontrada' });
      }

      // Atualizar os campos relacionados à árvore
      const novoVlTotalExtracoes = arvore.vl_total_extracoes + parseFloat(vl_volume);
      const novasExtracoes = arvore.qt_extracoes + 1;
      const novaMediaFrutos = novoVlTotalExtracoes / novasExtracoes;

      // Atualizar os dados no banco
      await arvore.update({
        vl_total_extracoes: novoVlTotalExtracoes,
        qt_extracoes: novasExtracoes,
        md_frutos: novaMediaFrutos,
      });

      // Criar o registro de extração
      const extracao = await Extracao.create({ arvores_id, vl_volume });

      const dataExtracao = new Date();
      const dataNotificacao = new Date();
      // Define a data da notificação para 20 dias no futuro
      //dataNotificacao.setDate(dataExtracao.getDate() + 20);

      dataNotificacao.setMinutes(dataExtracao.getMinutes() + 1);

      await Manutencao.create({
        usuario_id: usuarioId,
        arvores_id: arvores_id,
        data_extracao: dataExtracao,
        data_notificacao: dataNotificacao
      });
      // Retornar o registro da extração criada
      res.status(201).json(extracao);
    } catch (error) {
      console.error('Erro ao criar extração e agendar manutenção:', error);
      res.status(500).json({ error: 'Erro ao criar extração e agendar manutenção' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { vl_volume, created_at } = req.body;

    try {
      const [updated] = await Extracao.update({ vl_volume, created_at }, {
        where: { id }
      });
      if (updated) {
        res.status(200).json({ message: 'Extração atualizada com sucesso' });
      } else {
        res.status(404).json({ error: 'Extração não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao atualizar extração:', error);
      res.status(500).json({ error: 'Erro ao atualizar extração' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Extracao.destroy({ where: { id } });
      if (deleted) {
        res.status(204).json({ message: 'Extração excluída com sucesso' });
      } else {
        res.status(404).json({ error: 'Extração não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao excluir extração:', error);
      res.status(500).json({ error: 'Erro ao excluir extração' });
    }
  },

  findByArvore: async (req, res) => {
    const { arvores_id } = req.params;
    try {
      const extracoes = await Extracao.findAll({ where: { arvores_id } });
      res.json(extracoes);
    } catch (error) {
      console.error('Erro ao buscar extrações da árvore:', error);
      res.status(500).json({ error: 'Erro ao buscar extrações da árvore' });
    }
  },

  findById: async (req, res) => {
    const { id } = req.params;
    try {
      const extracao = await Extracao.findByPk(id);
      if (!extracao) {
        res.status(404).json({ error: 'Extração não encontrada' });
        return;
      }
      res.json(extracao);
    } catch (error) {
      console.error('Erro ao buscar extração:', error);
      res.status(500).json({ error: 'Erro ao buscar extração' });
    }
  },
  getExtracoesPorUsuario: async (request, response) => {
    try {
      const { usuarioId } = request.params;
      const todasAsExtracoes = await Extracao.findAll({
        include: [{
          model: Arvore,
          as: 'arvore',
          required: true,
          attributes: [],
          include: [{
            model: Plantacao,
            as: 'plantacao',
            required: true,
            attributes: [],
            where: {
              usuario_id: usuarioId
            }
          }]
        }]
      });

      return response.json(todasAsExtracoes);

    } catch (error) {
      console.error('Erro ao buscar todas as extrações do usuário:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = extracoesController;
