const Fazenda = require('../models/fazendas');

const FazendasController = {
  listar: async (req, res) => {
    try {
      const fazendas = await Fazenda.findAll({
        include: [
          {
            model: Usuario,
            as: 'proprietarios', // Relacionamento com proprietários
            attributes: ['id', 'nome', 'email'], // Campos que deseja trazer dos proprietários
          },
          {
            model: Plantacao,
            as: 'plantacoes', // Relacionamento com plantações
            attributes: ['id', 'tipo', 'area', 'data_plantio'], // Campos que deseja trazer das plantações
          }
        ]
      });
      res.status(200).json(fazendas);
    } catch (error) {
      console.error('Erro ao listar fazendas:', error);
      res.status(500).json({ error: 'Erro ao listar fazendas' });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const fazenda = await Fazenda.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'proprietarios', // Relacionamento com proprietários
            attributes: ['id', 'nome', 'email'], // Campos que deseja trazer dos proprietários
          },
          {
            model: Plantacao,
            as: 'plantacoes', // Relacionamento com plantações
            attributes: ['id', 'tipo', 'area', 'data_plantio'], // Campos que deseja trazer das plantações
          }
        ]
      });
      if (!fazenda) {
        return res.status(404).json({ error: 'Fazenda não encontrada' });
      }
      res.status(200).json(fazenda);
    } catch (error) {
      console.error('Erro ao buscar fazenda:', error);
      res.status(500).json({ error: 'Erro ao buscar fazenda' });
    }
  },

  criar: async (req, res) => {
    try {
      const { nome, localizacao, area_total } = req.body;
      const novaFazenda = await Fazenda.create({ nome, localizacao, area_total });
      res.status(201).json(novaFazenda);
    } catch (error) {
      console.error('Erro ao criar fazenda:', error);
      res.status(500).json({ error: 'Erro ao criar fazenda' });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, localizacao, area_total } = req.body;

      const fazenda = await Fazenda.findByPk(id);
      if (!fazenda) {
        return res.status(404).json({ error: 'Fazenda não encontrada' });
      }

      await fazenda.update({ nome, localizacao, area_total });
      res.status(200).json(fazenda);
    } catch (error) {
      console.error('Erro ao atualizar fazenda:', error);
      res.status(500).json({ error: 'Erro ao atualizar fazenda' });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      const fazenda = await Fazenda.findByPk(id);
      if (!fazenda) {
        return res.status(404).json({ error: 'Fazenda não encontrada' });
      }

      await fazenda.destroy(); // Exclusão lógica devido ao `paranoid: true`
      res.status(200).json({ message: 'Fazenda deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar fazenda:', error);
      res.status(500).json({ error: 'Erro ao deletar fazenda' });
    }
  }
};

module.exports = FazendasController;
