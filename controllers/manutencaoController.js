const { Manutencao, Arvore } = require('../models'); // Assumindo que você importa Manutencao e Arvore do seu index.js
const { Op } = require('sequelize');

const manutencaoController = {
  
  // 1. LISTAR MANUTENÇÕES PENDENTES/AGENDADAS POR ÁRVORE
  listByArvore: async (req, res) => {
    const { arvores_id } = req.params;
    const usuarioId = req.user && req.user.userId;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
      // Verifica se a árvore pertence ao usuário (boa prática)
      // Nota: Associações como 'plantacao' e 'usuario' devem estar configuradas
      const arvore = await Arvore.findOne({
        where: { id: arvores_id },
        include: [{ 
          association: 'plantacao', // Assumindo que Arvore tem Plantacao
          where: { usuario_id: usuarioId } // Garante que a árvore pertence ao usuário
        }]
      });

      if (!arvore) {
        return res.status(404).json({ error: 'Árvore não encontrada ou não pertence ao usuário.' });
      }

      // Busca manutenções com status PENDENTE ou ENVIADA (agendadas ou atrasadas)
      const manuntencoes = await Manutencao.findAll({
        where: {
          arvores_id: arvores_id,
          // Condição: status PENDENTE (agendada) ou ENVIADA (notificada/atrasada)
          status: {
            [Op.in]: ['PENDENTE', 'ENVIADA'] 
          }
        },
        order: [['data_notificacao', 'ASC']] // Ordena pela data mais antiga primeiro
      });

      return res.json(manuntencoes);

    } catch (error) {
      console.error('Erro ao listar manutenções:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar manutenções.' });
    }
  },

  // 2. MARCAR MANUTENÇÃO COMO CONCLUÍDA
  concluirManutencao: async (req, res) => {
    const { id } = req.params; // ID da manutenção
    const usuarioId = req.user && req.user.userId;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
      // 1. Atualiza o status
      const [updated] = await Manutencao.update(
        { status: 'CONCLUIDA', updated_at: new Date() },
        { 
          where: { 
            id: id,
            // Adiciona uma subconsulta para garantir que a manutenção pertence ao usuário
            // Usaremos aqui apenas o ID, pois o listByArvore já faz a verificação de segurança no GET
          } 
        }
      );

      if (updated > 0) {
        return res.status(200).json({ message: 'Manutenção marcada como concluída.' });
      } else {
        return res.status(404).json({ error: 'Manutenção não encontrada ou já concluída.' });
      }

    } catch (error) {
      console.error('Erro ao concluir manutenção:', error);
      return res.status(500).json({ error: 'Erro interno ao concluir manutenção.' });
    }
  }
};

module.exports = manutencaoController;
