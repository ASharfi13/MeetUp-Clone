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
      },
      {
        eventId: 6,
        url: 'https://sm.ign.com/ign_ap/review/s/samurai-ja/samurai-jack-season-5-review_fbks.png',
        preview: true
      },
      {
        eventId: 7,
        url: 'https://external-preview.redd.it/5U2fklz-g120vUEzgHO3jb25K0M69C1On9MKIPe7BX8.gif?format=png8&s=1726d9cad092743c18a84b390ed685283665c388',
        preview: true
      },
      {
        eventId: 8,
        url: 'https://sportshub.cbsistatic.com/i/2023/04/11/dd48a0d7-ec0c-443f-830e-6bd28a1cb2c7/grim-adventures-billy-mandy-revival-creator-comments.jpg',
        preview: true
      },
      {
        eventId: 9,
        url: 'https://m.media-amazon.com/images/M/MV5BZjE4OWI3NGQtMDFkOS00YTI5LWE0MzUtMGJiZmEzNzQ1ZjNkXkEyXkFqcGdeQXVyMTI2MzY3NTA3._V1_.jpg',
        preview: true
      },
      {
        eventId: 10,
        url: 'https://44.media.tumblr.com/cd978ad7e6e2724c1173d0c1cfc477af/bd6750fd539fc54b-ae/s540x810_f1/a79fb70b7262c954f2c57ad5eaef73658ab38344.gif',
        preview: true
      },
      {
        eventId: 11,
        url: 'https://i.pinimg.com/736x/e4/4d/6f/e44d6f362f7e4ce36235727d7290f8b4.jpg',
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
      eventId: {
        [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      }
    }, {})
  }
};
