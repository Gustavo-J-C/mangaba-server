'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Inserindo os usuários
    await queryInterface.bulkInsert('usuarios', [
      {
        id: 1,
        ds_tipo_documento: 'CPF',
        nu_documento: '1234567890',
        ds_nome_completo: 'André Luiz Andrade Rezende',
        ds_email: 'andre.luiz.rezende@gmail.com',
        ds_senha: '$2a$10$ng9rRJwFqT/CQy83vpGI6elGaLnslyU5eXdk1lhNEYoHPPoLt.2PS',
        created_at: new Date('2024-04-09 12:56:40'),
        updated_at: new Date('2025-09-22 23:44:07'),
        deleted_at: null,
        codigo_verificacao: '',
        fazenda_id: null
      },
      {
        id: 5,
        ds_tipo_documento: 'CPF',
        nu_documento: '86290736590',
        ds_nome_completo: 'Gustavo Costa',
        ds_email: 'gustavojsc9@gmail.com',
        ds_senha: '$2a$10$VDMjFByZIjV0CIEWDYIn6OSH0sf71hF8/3X2fsfxMI8Z3p4glgIrS',
        created_at: new Date('2024-04-15 00:02:24'),
        updated_at: new Date('2025-09-22 23:33:05'),
        deleted_at: null,
        codigo_verificacao: '',
        fazenda_id: null
      },
      {
        id: 25,
        ds_tipo_documento: 'CPF',
        nu_documento: '98200774007',
        ds_nome_completo: 'gustavo',
        ds_email: 'gustavo.coplan@gmail.com',
        ds_senha: '$2a$10$M4OO2HiIQo8Jt4zP3OoemugBPev1D0d6.09.9JxAfznTMWidDk8Fu',
        created_at: new Date('2025-07-22 01:32:45'),
        updated_at: null,
        deleted_at: null,
        codigo_verificacao: null,
        fazenda_id: null
      },
      {
        id: 26,
        ds_tipo_documento: 'CPF',
        nu_documento: '3475608570',
        ds_nome_completo: 'Beatriz',
        ds_email: 'abeatrizreis1@gmail.com',
        ds_senha: '$2a$10$PF0xxmnd8j.Rb6YoV2/SQ.CffZYXrw4dUimhJFk2TKbYUTCNSq9sm',
        created_at: new Date('2025-09-19 00:44:56'),
        updated_at: new Date('2025-10-10 16:37:49'),
        deleted_at: null,
        codigo_verificacao: '898AE7',
        fazenda_id: null
      }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    // Comando para reverter (apagar tudo)
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};