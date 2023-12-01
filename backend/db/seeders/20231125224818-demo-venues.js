'use strict';
const { Venue } = require('../models')

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
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: "aksjbgasjgsa",
        city: "asgasg",
        state: "FG",
        lat: 12.3478235,
        lng: 54.2124432
      },
      {
        groupId: 2,
        address: "bgasjgsa",
        city: "gasg",
        state: "LP",
        lat: 33.3424235,
        lng: 105.5114432
      },
      {
        groupId: 3,
        address: "akgasjgsa",
        city: "asgag",
        state: "IS",
        lat: 123.7621635,
        lng: 58.2124438
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
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      state: {
        [Op.in]: ["FG", "LP", "IS"]
      }
    }, {})
  }
};
