'use strict';

const { EventImage } = require('../models')

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
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "https://sample.edu/da",
        preview: true
      },
      {
        eventId: 2,
        url: "https://dample.edu/da",
        preview: false
      },
      {
        eventId: 3,
        url: "https://mple.edu/da",
        preview: true
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
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ["https://sample.edu/da", "https://dample.edu/da", "https://mple.edu/da"]
      }
    }, {})
  }
};
