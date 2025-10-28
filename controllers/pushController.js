// Importa os models do seu arquivo central de associações
const { DeviceToken } = require('../models'); 

exports.register = async (req, res) => {
  // Pegamos o ID do usuário que foi autenticado pelo middleware
  const usuarioId = req.usuario.id; // <-- Verifique se é req.usuario.id ou req.userId
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token é obrigatório.' });
  }

  try {
    // 'upsert' é a forma mais segura:
    // 1. Procura um DeviceToken com esse 'token'.
    // 2. Se achar, atualiza o 'usuario_id' (caso o usuário tenha logado de novo).
    // 3. Se não achar, cria um novo registro.
    // Isso evita tokens duplicados e mantém tudo atualizado.
    await DeviceToken.upsert({
      token: token,
      usuario_id: usuarioId,
      deleted_at: null // Garante que, se o token existia e foi "deletado", ele seja reativado
    });

    return res.status(200).json({ message: 'Token registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar token:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};