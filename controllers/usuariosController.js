const Usuario = require('../models/usuarios');

const usuariosController = {
  list: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },

  create: async (req, res) => {
    const { tipo_documento: ds_tipo_documento, nu_documento, nome_completo: ds_nome_completo, email: ds_email, senha: ds_senha } = req.body;
    
    try {
      const usuario = await Usuario.create({ ds_tipo_documento, nu_documento, ds_nome_completo, ds_email, ds_senha });
      res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { ds_tipo_documento, nu_documento, ds_nome_completo, ds_email, ds_senha } = req.body;
    try {
      const [updated] = await Usuario.update({ ds_tipo_documento, nu_documento, ds_nome_completo, ds_email, ds_senha }, {
        where: { id }
      });
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
      const deleted = await Usuario.destroy({ where: { id } });
      if (deleted) {
        res.status(204).json({ message: 'Usuário excluído com sucesso' });
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
  }
};

module.exports = usuariosController;
