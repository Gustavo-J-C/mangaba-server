const { Expo } = require('expo-server-sdk');
const cron = require('node-cron');
const { Op } = require('sequelize');
const { Manutencao, Usuario, DeviceToken, Arvore } = require('../models');

const expo = new Expo();

const enviarNotificaçõesPendentes = async () => {
  console.log('[CRON] Verificando notificações de manutenção pendentes...');

  const tarefas = await Manutencao.findAll({
    where: {
      status: {
        [Op.in]: ['PENDENTE', 'ENVIADA'] // Envia enquanto não for CONCLUIDA
      },
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
        as: 'arvoreParaManutencao'
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

  for (const tarefa of tarefas) {

    tarefasParaAtualizar.push(tarefa.id);

    if (tarefa.usuario && tarefa.usuario.device_tokens && tarefa.usuario.device_tokens.length > 0 && tarefa.arvoreParaManutencao) {

      const nomeArvore = tarefa.arvoreParaManutencao.ds_nome;

      let title = '';
      let body = '';

      if (tarefa.status === 'PENDENTE') {
        // Primeira vez que a notificação está sendo enviada
        title = '🌳 Lembrete Ativado: Manutenção!';
        body = `A manutenção da árvore "${nomeArvore}" está agendada para hoje. Por favor, realize a atividade.`;
      } else {
        // Status 'ENVIADA' (Repetição/Atraso)
        title = '🚨 ATENÇÃO: Manutenção Atrasada!';
        body = `⚠️ A manutenção da árvore "${nomeArvore}" ainda não foi concluída. Por favor, finalize a atividade no app.`;
      }

      for (const deviceToken of tarefa.usuario.device_tokens) {
        const token = deviceToken.token;

        if (!Expo.isExpoPushToken(token)) {
          // console.warn(`[CRON] Token inválido encontrado: ${token}`);
          continue;
        }

        messages.push({
          to: token,
          sound: 'default',
          title: title,
          body: body,
          data: { manutencaoId: tarefa.id, arvoreId: tarefa.arvores_id },
        });
      }
    } else {
      // console.log(`[CRON] Tarefa ID ${tarefa.id} marcada como 'ENVIADA', mas sem tokens para notificar.`);
    }
  }

  if (messages.length > 0) {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        // 1. Esta linha captura o resultado da Expo
        const tickets = await expo.sendPushNotificationsAsync(chunk);

        // 2. Esta linha (a sua) imprime o resultado
        console.log('[CRON] Notificações enviadas, tickets:', tickets);

      } catch (error) {
        // 3. E esta linha imprime se algo quebrar ANTES de chamar a Expo
        console.error('[CRON] Erro ao enviar chunk de notificações:', error);
      }
    }
  }

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
  }
};

exports.iniciarScheduler = () => {
  cron.schedule('30 7,12,19 * * *', enviarNotificaçõesPendentes, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
  });

  cron.schedule('*/1 * * * *', enviarNotificaçõesPendentes, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
  });

  console.log('Scheduler de Notificações iniciado (3 vezes ao dia + 5 em 5 minutos para debug).');

  enviarNotificaçõesPendentes();
};
