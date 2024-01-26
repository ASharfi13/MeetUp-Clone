'use strict';

const { Group } = require('../models')

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
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: "Group 1",
        about: "Unleashing creativity, fostering innovation – where ideas collide and brilliance thrives.",
        type: "In person",
        private: false,
        city: "Oak Lawn",
        state: "IL"
      },
      {
        organizerId: 2,
        name: "Group 2",
        about: "Where quirks meet intellect, unraveling mysteries in a delightful collective introspection.",
        type: "Online",
        private: true,
        city: "Smurfville",
        state: "TX"
      },
      {
        organizerId: 3,
        name: "Group 3",
        about: "Where the funniest, qurkiest, most annoying influencers get together and play D&D.",
        type: "In person",
        private: false,
        city: "Dungeon's Master",
        state: "AL"
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
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: "Group"
      }
    }, {})
  }
};
