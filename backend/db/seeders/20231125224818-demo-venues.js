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
        address: "34 Rigby Ave",
        city: "Benson's Park",
        state: "CA",
        lat: 12.3231567,
        lng: 54.2782913
      },
      {
        groupId: 2,
        address: "4352 N Mac St",
        city: "Mac's Imagination",
        state: "IL",
        lat: 33.3123978,
        lng: 105.5123548
      },
      {
        groupId: 3,
        address: "5674 S DeeDee Ave",
        city: "DexCity",
        state: "MA",
        lat: 123.7537621,
        lng: 58.2243512
      },
      {
        groupId: 4,
        address: '0000 W Aku Ave',
        city: 'AkuTown',
        state: 'AK',
        lat: 120.0000000,
        lng: 60.0000000
      },
      {
        groupId: 5,
        address: '1278 E Grim St',
        city: 'EndsVille',
        state: 'TX',
        lat: 145.0000000,
        lng: 85.0000000
      },
      {
        groupId: 6,
        address: '341 W Rolf St',
        city: 'JawbreakVille',
        state: 'IL',
        lat: 134.0000000,
        lng: 67.0000000
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
        [Op.in]: ["CA", "IL", "MA", "AK", "TX"]
      }
    }, {})
  }
};
