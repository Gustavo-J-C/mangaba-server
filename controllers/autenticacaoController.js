const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usuarios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const gerarCodigoVerificacao = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const enviarEmailCodigoVerificacao = async (email, codigo) => {
  try {
    // Opções do e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de verificação para redefinição de senha',
      text: `Seu código de verificação é: ${codigo}`
    };

    // Envie o e-mail
    const info = await transporter.sendMail(mailOptions);
    console.info('E-mail enviado:', info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail');
  }
};

const validarCodigoVerificacao = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    const user = await User.findOne({ where: { ds_email: email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.codigo_verificacao !== codigo) {
      return res.status(401).json({ message: 'Código de verificação inválido' });
    }

    // Aqui você pode adicionar lógica adicional, como a validação do tempo de expiração do código de verificação

    // Se todas as verificações passarem, o código é válido para o e-mail fornecido
    res.status(200).json({ message: 'Código de verificação válido' });
  } catch (error) {
    console.error('Erro ao validar código de verificação:', error);
    res.status(500).json({ message: 'Erro ao validar código de verificação' });
  }
};

const solicitarRedefinicaoSenha = async (req, res) => {
  try {
    const { email: ds_email } = req.body;

    const user = await User.findOne({ where: { ds_email: ds_email } });

    if (!user) {
      return res.status(404).json({ message: "Conta de usuário não existe." });
    }

    const codigoVerificacao = gerarCodigoVerificacao();

    // Salvar o código de verificação no banco de dados junto com o usuário
    user.codigo_verificacao = codigoVerificacao;
    await user.save();

    // Enviar o código de verificação por e-mail para o usuário
    await enviarEmailCodigoVerificacao(ds_email, codigoVerificacao);

    res.status(200).json({ message: 'Código de verificação enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ message: 'Erro ao solicitar redefinição de senha' });
  }
};

const registro = async function (req, res, next) {
  try {
    const { tipo_documento: ds_tipo_documento, nu_documento: documento, nome_completo: ds_nome_completo, email: ds_email, senha: ds_senha, confirmar_senha } = req.body;

    const existingEmailUser = await User.findOne({ where: { ds_email: ds_email } });
    const existingDocumentUser = await User.findOne({ where: { nu_documento: documento } });


    if (existingEmailUser) {
      return res.status(402).json({ message: 'Email já está em uso', code: 'EMAIL_ALREADY_EXISTS' });
    }

    if (existingDocumentUser) {
      return res.status(402).json({ message: 'Documento já está em uso', code: 'DOCUMENT_ALREADY_EXISTS' });
    }

    if (ds_senha !== confirmar_senha) {
      return res.status(422).json({ message: 'Senhas não coincidem', code: 'PASSWORD_MISMATCH' });
    }

    const hashedPassword = await bcrypt.hash(ds_senha, 10);

    const newUser = await User.create({
      ds_tipo_documento: ds_tipo_documento,
      nu_documento: documento,
      ds_nome_completo: ds_nome_completo,
      ds_email: ds_email,
      ds_senha: hashedPassword,
    });

    res.status(201).json({
      data: {
        message: 'Usuário registrado com sucesso',
        usuario: {
          id: newUser.id,
          nome_completo: newUser.ds_nome_completo,
          email: newUser.ds_email,
          documento: newUser.ds_documento,
          tipo_documento: newUser.ds_tipo_documento
        }
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

const resetarSenha = async (req, res) => {
  try {
    const { email: ds_email, novaSenha: nova_senha, confirmar_senha } = req.body;


    const user = await User.findOne({ where: { ds_email: ds_email } });

    if (!user) {
      return res.status(404).json({ message: 'Conta de usuário não existe.' });
    }

    const hashedPassword = await bcrypt.hash(nova_senha, 10);

    user.ds_senha = hashedPassword;
    user.codigo_verificacao = ""
    await user.save();

    res.status(200).json({ message: 'Redefinição de senha bem-sucedida' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro ao redefinir senha' });
  }
};

const login = async function (req, res, next) {
  try {
    const { email: ds_email, senha: ds_senha } = req.body;

    const user = await User.findOne({ where: { ds_email: ds_email } });

    if (!user) {
      return res.status(404).json({ message: "Conta de usuário não existe." });
    }

    // Verifique se a senha fornecida corresponde à senha armazenada (comparando hashes)
    const passwordMatch = await bcrypt.compare(ds_senha, user.ds_senha);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      message: 'Login bem-sucedido',
      data: {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          nome_completo: user.ds_nome_completo,
          email: user.ds_email,
          documento: user.nu_documento,
          tipo_documento: user.ds_tipo_documento
        }
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

const editarPerfil = async (req, res) => {
  try {
    const { nome_completo: ds_nome_completo } = req.body;
    const { userId } = req.user; // Assumindo que você tem middleware de autenticação que adiciona userId ao req
    console.log(`Editando perfil do usuário com ID: ${userId}`);
    
    // Buscar usuário atual
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('Usuário não encontrado');
      
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Validar se nome_completo foi fornecido
    if (!ds_nome_completo || ds_nome_completo.trim() === '') {
      return res.status(400).json({ message: 'Nome completo é obrigatório' });
    }

    // Atualizar apenas o nome completo (email e documento não podem ser alterados)
    user.ds_nome_completo = ds_nome_completo.trim();
    await user.save();

    res.status(200).json({
      message: 'Perfil atualizado com sucesso',
      data: {
        user: {
          id: user.id,
          nome_completo: user.ds_nome_completo,
          email: user.ds_email,
          documento: user.nu_documento,
          tipo_documento: user.ds_tipo_documento
        }
      }
    });
  } catch (error) {
    console.error('Erro ao editar perfil:', error);
    res.status(500).json({ message: 'Erro ao editar perfil' });
  }
};

const refreshToken = async (req, res) => {
  // 1. Pegue o cabeçalho 'refresh_token'
  const authHeader = req.headers["refresh_token"] || "";

  // 2. Separe a palavra "Bearer" do token
  const parts = authHeader.split(' ');

  // 3. Verifique se o formato está correto
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Refresh token mal formatado (esperado: "Bearer <token>")' });
  }

  // 4. Agora 'refresh_token' é *apenas* a string do token
  const refresh_token = parts[1];

  if (!refresh_token) {
    return res.status(401).send({ message: "Refresh token não fornecido" });
  }

  try {
    // 5. Esta verificação agora funcionará
    const decodedRefreshToken = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY)

    if (!decodedRefreshToken) {
      return res.status(401).send({ message: "Token de atualização inválido ou expirado" });
    }
    
    const user = await User.findByPk(decodedRefreshToken.userId);

    // Se o usuário não for encontrado (ex: conta deletada), force o logout
    if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(200).json({
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error('Erro ao renovar token:', error); // Log detalhado

    // 6. [MELHORIA] Não retorne 500 para um token inválido. Retorne 401.
    // Se o token expirou ou a assinatura é inválida, é um erro de autenticação.
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: "Refresh token inválido ou expirado", error: error.message });
    }
    
    // Se for outro erro (ex: banco de dados), aí sim é 500
    return res.status(500).send({ message: "Erro interno do servidor" });
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    res.status(400).json("Missing required paramaters");
  } else {
    try {
      const isTokenValid = await veryResetToken(token);
      if (!isTokenValid) {
        res.status(400).json("Invalid token");
      } else {
        const existingUser = await User.findOne({ email: isTokenValid });
        if (existingUser.resetToken !== token) {
          res.status(400).json("Invalid token");
        } else {
          res.status(200).json("Token is valid");
        }
      }
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
}

const generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_KEY, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

module.exports = {
  generateTokens,
  verifyToken,
  login,
  editarPerfil,
  registro,
  resetarSenha,
  refreshToken,
  solicitarRedefinicaoSenha,
  validarCodigoVerificacao
};
