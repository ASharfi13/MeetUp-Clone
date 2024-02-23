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
        city: "The Regular Park",
        state: "CA",
        backgroundImg: "https://i.pinimg.com/originals/d2/1d/34/d21d34159140d25f86ed3701827c7282.jpg"
      },
      {
        organizerId: 2,
        name: "The Imaginary House",
        about: "Enter the fantastical realm of Foster's Home for Imaginary Friends where the building itself is a psychedelic masterpiece that could make Willy Wonka jealous. Our main character, Mac, is a kid with a knack for imagining friends, and his imaginary buddy Bloo is the embodiment of mischief and sass – think Bugs Bunny with fur. Madame Foster, the caretaker, is a delightful mix of eccentricity and granny wisdom, and her imaginary friend, Mr. Herriman, is a rabbit who takes bureaucracy way too seriously, wearing a suit that screams, I mean business in Candy Land! The diverse bunch of imaginary friends populating the home could give the United Nations a run for its money, with quirky personalities that range from the melodramatic Wilt to the eccentric Eduardo. In this animated utopia, where forgotten friends find a home, chaos is the norm, and logic is left at the door faster than you can say Imagination at its finest!",
        type: "Online",
        private: false,
        city: "Mac's Imagination",
        state: "IL",
        backgroundImg: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd6fe3b9d-f0d7-46cc-98c9-b53bbdb52f49_4071x2351.png"
      },
      {
        organizerId: 3,
        name: "Dexter\'s Lab",
        about: "Step into the wacky world of Dexter's Laboratory, a place where Dexter, a child prodigy with a lab that defies the laws of physics, conducts experiments that could make Einstein scratch his head. Dexter's annoyingly charming sister, Dee Dee, is the perpetual disruptor of his scientific endeavors, turning his high-tech haven into a chaotic playground. Their mom, simply known as Mom, is the epitome of parental obliviousness, and their dad, Dad, is a classic example of the dad-joke aficionado. Dexter's nemesis and neighbor, Mandark, with his wild hair and maniacal laughter, is the yin to Dexter's yang, creating a rivalry that puts even the best sibling squabbles to shame. In this animated haven of madness and genius, Dexter's Laboratory is not just a room but a sanctuary where chaos and creativity collide.",
        type: "Online",
        private: true,
        city: "Dex\'s House",
        state: "AL",
        backgroundImg: "https://cn.i.cdn.ti-platform.com/content/1123/showpage/dexter%27s-laboratory/ae/dexterslab-backgroundbottom.jpg"
      },
      {
        organizerId: 1,
        name: 'Aku City (Future)',
        about: 'Aku City is a dystopian metropolis ruled by the malevolent shape-shifting demon, Aku, in the cartoon network program, Samurai Jack. It serves as a dark reflection of the world under Aku\'s oppressive reign, characterized by towering skyscrapers, polluted skies, and a pervasive sense of fear. The city is teeming with crime and corruption, with Aku\'s influence reaching every corner, instilling a sense of hopelessness among its inhabitants. Despite its technological advancements, Aku City is devoid of any semblance of freedom or justice, serving as a stark reminder of the villain\'s tyrannical grip on the world. Throughout Samurai Jack\'s journey, Aku City stands as a formidable obstacle, symbolizing the struggle against Aku\'s tyranny and the quest for liberation.',
        type: 'Online',
        private: false,
        city: "Aku City",
        state: 'AK',
        backgroundImg: "https://pbs.twimg.com/media/CtcVxYDXYAEcUPP.jpg"
      },
      {
        organizerId: 2,
        name: 'Endsville Elementary School',
        about: 'Endsville is a fictional town featured in Cartoon Network\'s program, The Grim Adventures of Billy and Mandy. It serves as the primary setting for the series, portraying a quirky and eccentric community where supernatural occurrences are a common sight. The town is depicted as a blend of suburban charm and dark humor, with its residents often encountering bizarre creatures and otherworldly phenomena. Despite its ominous name, Endsville exudes a unique charm with its colorful and diverse population, ranging from eccentric neighbors to peculiar monsters. The town\'s streets are filled with peculiar landmarks and establishments, reflecting the show\'s whimsical and macabre tone. Endsville serves as the backdrop for the misadventures of the titular characters, Billy, Mandy, and the Grim Reaper, as they navigate through bizarre escapades and confront various challenges.',
        type: 'In person',
        private: false,
        city: 'EndsVille',
        state: 'TX',
        backgroundImg: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/cdad7155817045.56099addbc356.jpg"
      },
      {
        organizerId: 3,
        name: 'The Ed Cul-De-Sac',
        about: 'The cul-de-sac is a central location in Cartoon Network\'s program, Ed, Edd n Eddy, serving as the main setting for the misadventures of the titular characters. It is a suburban neighborhood characterized by rows of colorful houses and a sense of camaraderie among its young residents. The cul-de-sac is where Ed, Edd, and Eddy, along with their group of friends, embark on various schemes and escapades in pursuit of jawbreakers. Despite its idyllic appearance, the cul-de-sac is also home to numerous quirky and eccentric characters, each adding to the neighborhood\'s charm and humor. Throughout the series, the cul-de-sac serves as the backdrop for the trio\'s hilarious antics and their interactions with the colorful cast of characters.',
        type: 'In person',
        private: true,
        city: "Peach Creak",
        state: 'NY',
        backgroundImg: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/9c9443e8-f672-4253-80de-cb3e826a1f9a/d5h3kvz-84a81649-dc1a-4d91-a466-6e5191105ceb.png"
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
        [Op.in]: ["Benson's Park", "The Imaginary House", "Dexter\'s Lab", 'Aku City (Future)', 'Endsville', 'The Ed Cul-De-Sac',]
      }
    }, {})
  }
};
