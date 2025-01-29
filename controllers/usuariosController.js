const Usuario = require('../models/usuarios');

const usuariosController = {
  list: async (req, res) => {
    try {
      const { include } = req.query; // Pega os parâmetros de inclusão
      const includes = [];

      if (include?.includes('fazenda')) {
        includes.push({
          model: Fazenda,
          as: 'fazenda', // Nome do alias usado na associação
        });
      }
      
      const usuarios = await Usuario.findAll({
        where: { deleted_at: null },
        include: includes, // Adiciona os includes baseados no req.query
      });

      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },

  create: async (req, res) => {
    const {
      fazenda_id,
      tipo_documento: ds_tipo_documento,
      nu_documento,
      nome_completo: ds_nome_completo,
      email: ds_email,
      senha: ds_senha,
      codigo_verificacao,
    } = req.body;

    try {
      const usuario = await Usuario.create({
        fazenda_id,
        ds_tipo_documento,
        nu_documento,
        ds_nome_completo,
        ds_email,
        ds_senha,
        codigo_verificacao,
      });
      res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const {
      fazenda_id,
      ds_tipo_documento,
      nu_documento,
      ds_nome_completo,
      ds_email,
      ds_senha,
      codigo_verificacao,
    } = req.body;

    try {
      const [updated] = await Usuario.update(
        {
          fazenda_id,
          ds_tipo_documento,
          nu_documento,
          ds_nome_completo,
          ds_email,
          ds_senha,
          codigo_verificacao,
        },
        { where: { id, deleted_at: null } } // Exclui usuários "soft-deleted" da busca
      );

      if (updated) {
        res.status(200).json({ message: 'Usuário atualizado com sucesso' });
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findOne({ where: { id, deleted_at: null } });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await usuario.update({ deleted_at: new Date() }); // Marca como excluído
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
  },
};

module.exports = usuariosController;
