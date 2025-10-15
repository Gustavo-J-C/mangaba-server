const Arvore = require('../models/arvores');
const Plantacao = require('../models/plantacoes');
const QRCode = require('qrcode');

const arvoresController = {

  list: async (req, res) => {
    try {
      const arvores = await Arvore.findAll();
      res.json(arvores);
    } catch (error) {
      console.error('Erro ao listar árvores:', error);
      res.status(500).json({ error: 'Erro ao listar árvores' });
    }
  },

  getArvoresPorPlantacao: async (req, res) => {
    const { plantacaoId } = req.params;

    try {
      const arvores = await Arvore.findAll({
        where: { plantacoes_id: plantacaoId }
      });

      res.json(arvores);
    } catch (error) {
      console.error('Erro ao buscar árvores da plantação:', error);
      res.status(500).json({ error: 'Erro ao buscar árvores da plantação' });
    }
  },

  getArvore: async (req, res) => {
    const { id } = req.params;

    try {
      const arvore = await Arvore.findByPk(id);

      if (!arvore) {
        return res.status(404).json({ error: 'Árvore não encontrada' });
      }

      const createdAtString = arvore.created_at.toISOString();

      // Incluindo o id e a data de criação formatada na string do QR code
      const qrString = JSON.stringify({ id: arvore.id, created_at: createdAtString });

      QRCode.toDataURL(qrString, (err, url) => {
        if (err) {
          console.error('Erro ao gerar o QR code:', err);
          return res.status(500).json({ error: 'Erro ao gerar o QR code' });
        }

        res.status(200).json({ arvore, qrCode: url });
      });
    } catch (error) {
      console.error('Erro ao buscar a árvore:', error);
      res.status(500).json({ error: 'Erro ao buscar a árvore' });
    }
  },

  create: async (req, res) => {
    const { plantacoes_id, ds_nome, ds_descricao, longitude, latitude } = req.body;

    if (!plantacoes_id || !ds_nome || !ds_descricao || !longitude || !latitude) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (typeof plantacoes_id !== 'number') {
      return res.status(400).json({ error: 'O campo plantacoes_id deve ser um número' });
    }

    if (typeof ds_nome !== 'string' || typeof ds_descricao !== 'string') {
      return res.status(400).json({ error: 'Os campos ds_nome e ds_descricao devem ser strings' });
    }

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return res.status(400).json({ error: 'Os campos longitude e latitude devem ser números' });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'A longitude deve estar no intervalo válido (-180 a 180)' });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ error: 'A latitude deve estar no intervalo válido (-90 a 90)' });
    }

    try {
      const localizacao = { type: 'Point', coordinates: [longitude, latitude] };

      const arvore = await Arvore.create({ plantacoes_id, ds_nome, ds_descricao, localizacao });
      res.status(201).json(arvore);
    } catch (error) {
      console.error('Erro ao criar árvore:', error);
      res.status(500).json({ error: 'Erro ao criar árvore' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { plantacoes_id, ds_nome, ds_descricao, longitude, latitude } = req.body;
    const localizacao = { type: 'Point', coordinates: [longitude, latitude] };
    try {
      const [updated] = await Arvore.update({ plantacoes_id, ds_nome, ds_descricao, localizacao }, {
        where: { id }
      });
      if (updated) {
        res.status(200).json({ message: 'Árvore atualizada com sucesso' });
      } else {
        res.status(404).json({ error: 'Árvore não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao atualizar árvore:', error);
      res.status(500).json({ error: 'Erro ao atualizar árvore' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Arvore.destroy({ where: { id } });
      if (deleted) {
        res.status(204).json({ message: 'Árvore excluída com sucesso' });
      } else {
        res.status(404).json({ error: 'Árvore não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao excluir árvore:', error);
      res.status(500).json({ error: 'Erro ao excluir árvore' });
    }
  },

  getQRCode: async (req, res) => {
    const { id } = req.params;

    try {
      const arvore = await Arvore.findByPk(id);

      if (!arvore) {
        return res.status(404).json({ error: 'Árvore não encontrada' });
      }
      const createdAtString = arvore.created_at.toISOString();

      // Incluindo o id e a data de criação formatada na string do QR code
      const qrString = JSON.stringify({ id: arvore.id, created_at: createdAtString });

      QRCode.toDataURL(qrString, (err, url) => {
        if (err) {
          console.error('Erro ao gerar o QR code:', err);
          return res.status(500).json({ error: 'Erro ao gerar o QR code' });
        }

        res.send(`<img src="${url}" alt="QR code" />`);
      });
    } catch (error) {
      console.error('Erro ao buscar a árvore:', error);
      res.status(500).json({ error: 'Erro ao buscar a árvore' });
    }
  },
  getArvoresPorUsuario: async (request, response) => {
    try {
      const { usuarioId } = request.params;
      const todasAsArvores = await Arvore.findAll({
        include: [{
          model: Plantacao,
          as: 'plantacao', 
          required: true,
          where: {
            usuario_id: usuarioId
          },
          attributes: []
        }]
      });

      return response.json(todasAsArvores);

    } catch (error) {
      console.error('Erro ao buscar todas as árvores do usuário:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = arvoresController;
