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
        url: "https://www.slashfilm.com/img/gallery/fosters-home-for-imaginary-friends-everything-we-know-about-the-upcoming-reboot/l-intro-1658197615.jpg",
        preview: true
      },
      {
        groupId: 3,
        url: "https://cn.i.cdn.ti-platform.com/content/1123/showpage/dexter%27s-laboratory/ae/dexterslab-backgroundbottom.jpg",
        preview: true
      },
      {
        groupId: 4,
        url: 'https://atomicsam.files.wordpress.com/2013/02/samurai-jack-photo-1.jpg',
        preview: true
      },
      {
        groupId: 5,
        url: 'https://i0.wp.com/johnnyalucard.com/wp-content/uploads/2020/11/Grim-Adventures-of-Billy-Mandy-1.png?fit=750%2C423&ssl=1',
        preview: true
      },
      {
        groupId: 6,
        url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/9c9443e8-f672-4253-80de-cb3e826a1f9a/d5h3kvz-84a81649-dc1a-4d91-a466-6e5191105ceb.png',
        preview: true
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
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2, 3, 4, 5, 6]
      }
    }, {})
  }
};
