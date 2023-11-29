'use strict';
let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // defines your schema in the options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        }
      },
      name: {
        type: Sequelize.STRING(60),
      },
      about: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING
      },
      private: {
        type: Sequelize.BOOLEAN
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.dropTable('Groups');
  }
};
