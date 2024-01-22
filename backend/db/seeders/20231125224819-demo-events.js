'use strict';

const { Event } = require('../models');

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

    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: "Event 1",
        description: "The famous, undisclosed Mud-Gate paradise that Louis from the show Suits frequents tri-weekly!",
        type: "Online",
        capacity: 121,
        price: 34.32,
        startDate: '2023-2-23 20:30:00',
        endDate: '2012-11-2 20:30:00'
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Event 2",
        description: "A Sock convention inspired by that one guy from Criminal Minds who bet on horses!",
        type: "In person",
        capacity: 121,
        price: 34.32,
        startDate: '2023-2-23 9:00:00',
        endDate: '2025-11-2 9:00:00'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Event 3",
        description: "Have you killed a cow in Runescape and are now facing serious murder charges? Don't worry, we got you.",
        type: "Online",
        capacity: 121,
        price: 34.32,
        startDate: '2023-11-12 17:00:00',
        endDate: '2023-5-2 17:00:00'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Event 4",
        description: "You cannot escape the funk so don't even try, like please stop fr. The funk is coming to get you, it knows where you live so just be prepared :).",
        type: "In person",
        capacity: 500,
        price: 10.00,
        startDate: '2023-5-12 22:00:00',
        endDate: '2023-6-2 22:00:00'
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
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: "Event"
      }
    }, {})
  }
};
