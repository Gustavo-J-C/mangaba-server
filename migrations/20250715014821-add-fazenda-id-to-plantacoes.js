'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Renomear coluna usuarios_id para usuario_id, se existir
    const tableDefinition = await queryInterface.describeTable('plantacoes');
    if (tableDefinition.usuarios_id && !tableDefinition.usuario_id) {
      await queryInterface.renameColumn('plantacoes', 'usuarios_id', 'usuario_id');
    }

    // Adicionar coluna fazenda_id, se não existir
    if (!tableDefinition.fazenda_id) {
      await queryInterface.addColumn('plantacoes', 'fazenda_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'fazendas',
          key: 'id',
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('plantacoes');

    // Reverter o nome da coluna para usuarios_id
    if (tableDefinition.usuario_id && !tableDefinition.usuarios_id) {
      await queryInterface.renameColumn('plantacoes', 'usuario_id', 'usuarios_id');
    }

    // Remover coluna fazenda_id
    if (tableDefinition.fazenda_id) {
      await queryInterface.removeColumn('plantacoes', 'fazenda_id');
    }
  },

};
