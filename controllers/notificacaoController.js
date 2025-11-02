const { Notificacao } = require('../models'); 

/**
 * Lista todas as notificações NÃO EXCLUÍDAS do usuário logado.
 * (O Sequelize automaticamente filtra as 'deleted_at IS NULL' por causa do 'paranoid: true')
 */
exports.list = async (req, res) => {
  try {
    const usuarioId = req.user.userId; 

    const notificacoes = await Notificacao.findAll({
      where: { usuario_id: usuarioId },
      order: [['created_at', 'DESC']], 
    });

    return res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

/**
 * Marca uma notificação específica como lida.
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params; // ID da notificação
    const usuarioId = req.user.userId;

    // --- CORREÇÃO AQUI ---
    // Mude Notificacoes para Notificacao (singular)
    const notificacao = await Notificacao.findOne({ 
      where: { id: id, usuario_id: usuarioId }
    });
    // ---------------

    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada.' });
    }

    notificacao.lida = true;
    await notificacao.save();

    return res.status(200).json(notificacao);
  } catch (error) {
    console.error('Erro ao marcar como lida:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

/**
 * Exclui (soft delete) uma notificação específica.
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params; // ID da notificação
    const usuarioId = req.user.userId;

    const notificacao = await Notificacao.findOne({
      where: {
        id: id,
        usuario_id: usuarioId // Garante que o usuário só pode excluir a *sua* notificação
      }
    });

    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada.' });
    }

    // Graças ao 'paranoid: true', .destroy() faz um soft delete (define o deleted_at)
    await notificacao.destroy();

    return res.status(200).json({ message: 'Notificação excluída com sucesso.' });
  
  } catch (error) {
    console.error('Erro ao excluir notificação:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};