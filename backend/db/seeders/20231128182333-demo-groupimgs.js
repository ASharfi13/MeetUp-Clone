'use strict';

const { GroupImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "https://sle.info/#cor",
        preview: false
      },
      {
        groupId: 2,
        url: "https://samle.info/#cor",
        preview: true
      },
      {
        groupId: 2,
        url: "https://smple.info/#cor",
        preview: false
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2]
      }
    }, {})
  }
};
