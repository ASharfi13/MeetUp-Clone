'use strict';

const { EventImage } = require('../models')

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
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "https://d.ibtimes.co.uk/en/full/1448964/mordecai-rigby-regular-show.jpg?w=1600&h=1200&q=88&f=459e1b424c3269652d484755ec7874d6",
        preview: true
      },
      {
        eventId: 2,
        url: "https://preview.redd.it/why-did-they-nerf-skips-in-the-later-seasons-v0-82gy2py2ybta1.jpg?width=640&crop=smart&auto=webp&s=c58fc36faf1f6ec122c46226002329cf37576ebf",
        preview: false
      },
      {
        eventId: 3,
        url: "https://static.tvtropes.org/pmwiki/pub/images/622131b68c56b4d4a6a3371977c517a8.jpg",
        preview: true
      },
      {
        eventId: 4,
        url: "https://miro.medium.com/v2/resize:fit:800/1*zGLptIYZw00rdpmgYq4dFQ.jpeg",
        preview: true
      },
      {
        eventId: 5,
        url: "https://media.tenor.com/lRAQgoWzouMAAAAe/dexters-lab-angry.png",
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
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ["https://sample.edu/da", "https://dample.edu/da", "https://mple.edu/da"]
      }
    }, {})
  }
};
