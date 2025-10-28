const { Expo } = require('expo-server-sdk');
const cron = require('node-cron');
const { Op } = require('sequelize');
const { Manutencao, Usuario, DeviceToken, Arvore } = require('../models'); 

const expo = new Expo();

const enviarNotificaçõesPendentes = async () => {
  console.log('[CRON] Verificando notificações de manutenção pendentes...');

  const tarefas = await Manutencao.findAll({
    where: {
      status: 'PENDENTE',
      data_notificacao: {
        [Op.lte]: new Date() 
      }
    },
    include: [
      {
        model: Usuario,
        as: 'usuario', 
        include: {
          model: DeviceToken,
          as: 'device_tokens'
        }
      },
      {
        model: Arvore,
        as: 'arvoreParaManutencao' // <-- O alias correto
      }
    ]
  });

  if (!tarefas || tarefas.length === 0) {
    console.log('[CRON] Nenhuma notificação para enviar.');
    return;
  }

  console.log(`[CRON] Encontradas ${tarefas.length} tarefas. Preparando envio...`);
  
  const messages = []; 
  const tarefasParaAtualizar = []; 

  // --- LÓGICA CORRIGIDA ---
  for (const tarefa of tarefas) {
    
    // 1. Adiciona a tarefa na fila para ser atualizada (SEMPRE)
    tarefasParaAtualizar.push(tarefa.id);

    // 2. Verifica se temos os dados necessários para ENVIAR a notificação
    //    (Verifica o alias correto e se o array de tokens tem tamanho > 0)
    if (tarefa.usuario && tarefa.usuario.device_tokens && tarefa.usuario.device_tokens.length > 0 && tarefa.arvoreParaManutencao) {
      
      const nomeArvore = tarefa.arvoreParaManutencao.ds_nome; // <-- O alias correto
      
      // 3. Se tivermos tokens, monta as mensagens
      for (const deviceToken of tarefa.usuario.device_tokens) {
        const token = deviceToken.token;

        if (!Expo.isExpoPushToken(token)) {
          console.warn(`[CRON] Token inválido encontrado: ${token}`);
          continue;
        }

        messages.push({
          to: token,
          sound: 'default',
          title: '🌳 Manutenção de Mangaba!',
          body: `Lembrete: A árvore "${nomeArvore}" precisa de manutenção no tronco.`,
          data: { manutencaoId: tarefa.id, arvoreId: tarefa.arvores_id }, 
        });
      }
    } else {
      // Este log vai aparecer no teste do Emulador!
      console.log(`[CRON] Tarefa ID ${tarefa.id} marcada como 'ENVIADA', mas sem tokens para notificar.`);
    }
  }
  // --- FIM DA CORREÇÃO ---

  // 4. Envia as notificações (SE houver alguma)
  if (messages.length > 0) {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        console.log('[CRON] Notificações enviadas, tickets:', tickets);
      } catch (error) {
        console.error('[CRON] Erro ao enviar chunk de notificações:', error);
      }
    }
  }

  // 5. Atualiza o status de TODAS as tarefas encontradas
  if (tarefasParaAtualizar.length > 0) {
    await Manutencao.update(
      { status: 'ENVIADA' },
      {
        where: {
          id: {
            [Op.in]: tarefasParaAtualizar
          }
        }
      }
    );
    console.log(`[CRON] Status de ${tarefasParaAtualizar.length} tarefas atualizado para 'ENVIADA'.`);
  }
};

exports.iniciarScheduler = () => {
  
  const config = {
    scheduled: true,
    timezone: "America/Sao_Paulo"
  };

  // 1. Agendamento para 07:30 (Minuto 30, Hora 7)
  cron.schedule('30 7 * * *', enviarNotificaçõesPendentes, config);

  // 2. Agendamento para 12:00 (Minuto 0, Hora 12)
  cron.schedule('0 12 * * *', enviarNotificaçõesPendentes, config);

  // 3. Agendamento para 19:30 (Minuto 30, Hora 19)
  cron.schedule('30 19 * * *', enviarNotificaçõesPendentes, config);

  // Mensagem de log atualizada
  console.log('Scheduler de Notificações iniciado (3x ao dia: 07:30, 12:00, 19:30).');
  
  // Roda uma vez ao iniciar (para pegar tarefas atrasadas)
  enviarNotificaçõesPendentes(); 
};