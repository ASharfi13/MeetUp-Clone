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
        name: "Mordecai & Rigby's Summer Bash",
        description: "Come to the Park this weekend for a night of putting off important work, video games, and a super chaotic boss fight with a mystery antagonist!",
        type: "In person",
        capacity: 150,
        price: 10,
        startDate: '2024-3-23 20:30:00',
        endDate: '2024-4-23 24:30:00'
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Skips Pilates",
        description: "Hardwork, dedication, and eating right. That's how you get the body of your dreams - at least in real life. Come to the Park for an inter-dimensional course on how to achieve a rock hard core in exactly 18 minutes or your money back!",
        type: "In person",
        capacity: 150,
        price: 15,
        startDate: '2023-1-15 20:30:00',
        endDate: '2023-1-16 24:30:00'
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Foster's Intervention",
        description: "Our dear friend Foster has been claiming that he lives in a giant mansion with pink interior design and his best friend is an animated blue blob and a tall red man with one and half arms who plays professional basketball. Help us get him the help he needs. ",
        type: "In person",
        capacity: 20,
        price: 0,
        startDate: '2024-2-23 9:00:00',
        endDate: '2024-2-24 9:00:00'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Dexter's Lab-Off Pt 1",
        description: "The Cross-over of the Century! Dexter out and eager to prove that he's the MOST SKILLED chemist there is, has invited one of the most infamous chemists there is. Coming from Albuquerque, New Mexico - Jessie Pinkman (Post Season 3) is in town and ready to throw down. Who will prevail in this scientific battle!",
        type: "Online",
        capacity: 500,
        price: 25,
        startDate: '2023-1-12 17:00:00',
        endDate: '2023-1-13 17:00:00'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Dexter's Lab-Off Pt 2",
        description: "After easily defeating Jessie last time, Dexter is back to prove that no one can out skill him in the lab! This time Walter White, Mr.Heisenberg, steps up to the challenge. This will definitely be a lot harder, but Dexter is as confident as ever. Can he prove once and for all that he's the ultimate chemist!",
        type: "In person",
        capacity: 500,
        price: 50,
        startDate: '2024-6-20 22:00:00',
        endDate: '2024-6-21 22:00:00'
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
