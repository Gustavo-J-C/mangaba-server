'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('arvores');

    if (!table.dt_plantio) {
      await queryInterface.addColumn('arvores', 'dt_plantio', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    if (!table.status) {
      await queryInterface.addColumn('arvores', 'status', {
        type: Sequelize.ENUM('Plantada', 'Vingou', 'Não Vingou', 'Produzindo'),
        allowNull: true,
      });
    }

    if (!table.qt_extracoes) {
      await queryInterface.addColumn('arvores', 'qt_extracoes', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.vl_total_extracoes) {
      await queryInterface.addColumn('arvores', 'vl_total_extracoes', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.md_frutos) {
      await queryInterface.addColumn('arvores', 'md_frutos', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.md_tempo_extracoes) {
      await queryInterface.addColumn('arvores', 'md_tempo_extracoes', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('arvores');

    if (table.dt_plantio) await queryInterface.removeColumn('arvores', 'dt_plantio');
    if (table.status) await queryInterface.removeColumn('arvores', 'status');
    if (table.qt_extracoes) await queryInterface.removeColumn('arvores', 'qt_extracoes');
    if (table.vl_total_extracoes) await queryInterface.removeColumn('arvores', 'vl_total_extracoes');
    if (table.md_frutos) await queryInterface.removeColumn('arvores', 'md_frutos');
    if (table.md_tempo_extracoes) await queryInterface.removeColumn('arvores', 'md_tempo_extracoes');

    // Remover ENUM status se necessário
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_arvores_status";`);
  },
};
