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
        startDate: '2024-03-23T20:30',
        endDate: '2024-03-23T23:30'
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Skips Pilates",
        description: "Hardwork, dedication, and eating right. That's how you get the body of your dreams - at least in real life. Come to the Park for an inter-dimensional course on how to achieve a rock hard core in exactly 18 minutes or your money back!",
        type: "In person",
        capacity: 150,
        price: 15,
        startDate: '2023-12-20T14:30',
        endDate: '2023-12-20T16:00'
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Foster's Intervention",
        description: "Our dear friend Foster has been claiming that he lives in a giant mansion with pink interior design and his best friend is an animated blue blob and a tall red man with one and half arms who plays professional basketball. Help us get him the help he needs. ",
        type: "In person",
        capacity: 20,
        price: 0,
        startDate: '2024-02-14T15:00',
        endDate: '2024-02-14T16:30'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Dexter's Lab-Off Pt 1",
        description: "The Cross-over of the Century! Dexter out and eager to prove that he's the MOST SKILLED chemist there is, has invited one of the most infamous chemists there is. Coming from Albuquerque, New Mexico - Jessie Pinkman (Post Season 3) is in town and ready to throw down. Who will prevail in this scientific battle!",
        type: "Online",
        capacity: 500,
        price: 25,
        startDate: '2023-01-12T17:30',
        endDate: '2023-01-12T19:30'
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Dexter's Lab-Off Pt 2",
        description: "After easily defeating Jessie last time, Dexter is back to prove that no one can out skill him in the lab! This time Walter White, Mr.Heisenberg, steps up to the challenge. This will definitely be a lot harder, but Dexter is as confident as ever. Can he prove once and for all that he's the ultimate chemist!",
        type: "In person",
        capacity: 500,
        price: 50,
        startDate: '2024-02-20T17:30',
        endDate: '2024-02-20T19:30'
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'Jack\'s Black & White Movie Night',
        description: 'Samurai Jack hosts a captivating black and white movie night, transporting viewers to an era of classic cinema magic. The ambiance is steeped in nostalgia as the flickering light of the projector illuminates the room, casting shadows reminiscent of film noir. Guests are enthralled by Jack\'s curated selection of timeless films, immersing themselves in the monochromatic world of intrigue and adventure.',
        type: 'In person',
        capacity: 250,
        price: 0,
        startDate: '2024-02-10T20:30',
        endDate: '2024-02-11T00:30'
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'Aku\'s Disco Dance Night',
        description: 'Aku, the malevolent demon from Samurai Jack, hosts a mesmerizing disco dance night that pulsates with dark energy and wicked beats. The dance floor is engulfed in swirling shadows as Aku\'s sinister presence looms over the revelers, adding an eerie atmosphere to the festivities. Guests are spellbound by Aku\'s hypnotic moves, blending his villainous charm with the allure of the disco era.',
        type: 'In person',
        capacity: '1000',
        price: 45,
        startDate: '2024-01-30T21:00',
        endDate: '2024-01-31T00:00'
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Grim\'s Seance Steak Cooking Demo',
        description: 'In a whimsical cooking demo event, Grim, the Grim Reaper from Cartoon Network\'s Grim Adventures of Billy and Mandy, takes center stage to unveil his coveted recipe for his signature steak. With his trademark scythe in hand and a mischievous grin, Grim guides participants through each step of the cooking process, infusing the demonstration with his dark humor and unique flair. As the aroma of sizzling steak fills the air, attendees are treated to a culinary experience like no other, mastering Grim\'s secret technique for achieving the perfect sear and flavor.',
        type: 'Online',
        capacity: '550',
        price: 5,
        startDate: '2024-02-13T14:00',
        endDate: '2024-02-13T15:00'
      },
      {
        venueId: 1,
        groupId: 5,
        name: 'Grim\'s Hike To Benson\'s Park',
        description: 'In this Cross-Over Event! Grim, the iconic Grim Reaper from Cartoon Network\'s Grim Adventures of Billy and Mandy, embarks on a whimsical hike to the fictional setting of Benson\'s Park from Regular Show. With his scythe in hand and an air of curiosity, Grim traverses through the surreal landscape, encountering quirky characters and unexpected challenges along the way. As he explores the park\'s eccentricities, Grim brings his trademark wit and dark humor to the adventure, adding a unique twist to the Regular Show universe.',
        type: 'In person',
        capacity: '10',
        price: 500,
        startDate: '2024-01-15T12:30',
        endDate: '2024-01-18T08:30'
      },
      {
        venueId: 6,
        groupId: 6,
        name: 'Eddy\'s Wealth Seminar',
        description: 'In a lively and charismatic display, Eddy from Cartoon Network\'s Ed, Edd n Eddy hosts a dynamic wealth seminar event, aiming to impart his savvy entrepreneurial knowledge to eager participants. With his trademark scheming grin and endless enthusiasm, Eddy shares invaluable tips and tricks on how to strike it rich in the cul-de-sac economy. Attendees are captivated by Eddy\'s energetic presentation style and innovative money-making schemes, leaving inspired to embark on their own entrepreneurial endeavors.',
        type: 'Online',
        capacity: 1500,
        price: 250,
        startDate: '2024-05-12T11:30',
        endDate: '2024-05-12T15:00'
      },
      {
        venueId: 6,
        groupId: 6,
        name: 'Johnny & Plank\'s Backyard Date Night',
        description: 'In a charming backyard setting, Johnny and Plank from Cartoon Network\'s Ed, Edd n Eddy host a cozy and whimsical date night event. Surrounded by twinkling lights and homemade decorations, the duo creates a romantic atmosphere for couples to enjoy quality time together. With Plank as their silent but supportive third wheel, guests revel in the warmth of friendship and the simplicity of a perfect evening under the stars.',
        type: 'In person',
        capacity: 35,
        price: 15,
        startDate: '2024-02-14T18:30',
        endDate: '2024-02-14T22:30'
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
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2, 3, 4, 5, 6]
      }
    }, {})
  }
};
