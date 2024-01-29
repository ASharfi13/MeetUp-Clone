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
        name: "Benson's Park",
        about: "In the thrilling world of the Regular Show, the park is like Disneyland for oddballs, where even the squirrels wear sunglasses and plot world domination. Mordecai, a perpetually bored blue jay, and Rigby, a raccoon with a Ph.D. in slacking off, have job titles that make no sense, and their boss, Benson, is a walking embodiment of coffee-fueled frustration. The talking gumball machine, Pops, floats around the park, blissfully unaware of the chaos that ensues daily. Lastly, Muscle Man and his oh-so-charming buddy, High-Five Ghost, are the epitome of sophistication, with their profound insights into life. Nonetheless, this gang finds themselves in the most insane predictaments, anything can happen",
        type: "In person",
        private: true,
        city: "The Park",
        state: "CA"
      },
      {
        organizerId: 2,
        name: "The Imaginary House",
        about: "Enter the fantastical realm of Foster's Home for Imaginary Friends where the building itself is a psychedelic masterpiece that could make Willy Wonka jealous. Our main character, Mac, is a kid with a knack for imagining friends, and his imaginary buddy Bloo is the embodiment of mischief and sass – think Bugs Bunny with fur. Madame Foster, the caretaker, is a delightful mix of eccentricity and granny wisdom, and her imaginary friend, Mr. Herriman, is a rabbit who takes bureaucracy way too seriously, wearing a suit that screams, I mean business in Candy Land! The diverse bunch of imaginary friends populating the home could give the United Nations a run for its money, with quirky personalities that range from the melodramatic Wilt to the eccentric Eduardo. In this animated utopia, where forgotten friends find a home, chaos is the norm, and logic is left at the door faster than you can say Imagination at its finest!",
        type: "Online",
        private: false,
        city: "Mac's Imagination",
        state: "IL"
      },
      {
        organizerId: 3,
        name: "Dexter's Lab",
        about: "Step into the wacky world of Dexter's Laboratory, a place where Dexter, a child prodigy with a lab that defies the laws of physics, conducts experiments that could make Einstein scratch his head. Dexter's annoyingly charming sister, Dee Dee, is the perpetual disruptor of his scientific endeavors, turning his high-tech haven into a chaotic playground. Their mom, simply known as Mom, is the epitome of parental obliviousness, and their dad, Dad, is a classic example of the dad-joke aficionado. Dexter's nemesis and neighbor, Mandark, with his wild hair and maniacal laughter, is the yin to Dexter's yang, creating a rivalry that puts even the best sibling squabbles to shame. In this animated haven of madness and genius, Dexter's Laboratory is not just a room but a sanctuary where chaos and creativity collide.",
        type: "Online",
        private: true,
        city: "Dex's Lab",
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
