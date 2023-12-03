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
        address: "TooGoochIsland",
        city: "TheLand",
        state: "FG",
        lat: 12.3231567,
        lng: 54.2782913
      },
      {
        groupId: 2,
        address: "IdkWhereIAm",
        city: "TheSky",
        state: "LP",
        lat: 33.3123978,
        lng: 105.5123548
      },
      {
        groupId: 3,
        address: "IsThatDannyDevito",
        city: "M&MLand",
        state: "IS",
        lat: 123.7537621,
        lng: 58.2243512
      }
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
