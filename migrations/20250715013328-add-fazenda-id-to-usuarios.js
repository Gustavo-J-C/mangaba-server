'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'fazenda_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'fazendas',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'fazenda_id');
  }
};
