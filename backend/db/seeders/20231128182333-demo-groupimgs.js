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
        url: "https://i.ytimg.com/vi/J613wJr2lSI/maxresdefault.jpg",
        preview: true
      },
      {
        groupId: 2,
        url: "https://static.planetminecraft.com/files/image/minecraft/project/2022/332/15262055_xl.webp",
        preview: true
      },
      {
        groupId: 3,
        url: "https://cn.i.cdn.ti-platform.com/content/1123/showpage/dexter%27s-laboratory/ae/dexterslab-backgroundbottom.jpg",
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
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2]
      }
    }, {})
  }
};
