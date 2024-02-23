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
        url: "https://www.syfy.com/sites/syfy/files/2021/05/dexters-lab.jpeg",
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
        url: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/03/Ed-Edd-n-Eddy-1.jpg',
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
