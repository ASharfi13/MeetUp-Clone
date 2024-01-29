'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: "Demo",
        lastName: "User",
        email: 'demoUser@user.io',
        username: 'DemoUser1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Humpty",
        lastName: "Nonews",
        email: 'userBigCakes1@user.io',
        username: 'Batman2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: "Bruce",
        lastName: "Parker",
        email: 'userNotTooSmall2@user.io',
        username: 'BigMans4',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Spiderman3', 'Batman2', 'BigMans4'] }
    }, {});
  }
};
