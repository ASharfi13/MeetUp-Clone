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
        name: "group1",
        about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Erat nam at lectus urna duis convallis convallis. Eget dolor morbi non arcu risus quis varius quam quisque. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit. Pretium fusce id velit ut tortor. Ut tortor pretium viverra suspendisse potenti nullam ac tortor. Orci eu lobortis elementum nibh. A condimentum vitae sapien pellentesque habitant morbi tristique senectus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Imperdiet nulla malesuada pellentesque elit eget gravida. Fermentum iaculis eu non diam phasellus vestibulum. Platea dictumst quisque sagittis purus sit amet volutpat consequat. Ut ornare lectus sit amet est placerat in egestas. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Diam maecenas sed enim ut sem. Odio ut enim blandit volutpat maecenas volutpat blandit. In hac habitasse platea dictumst vestibulum rhoncus. Tortor consequat id porta nibh. Nulla facilisi nullam vehicula ipsum a arcu.",
        type: "In person",
        private: false,
        city: "Oak Lawn",
        state: "OL"
      },
      {
        organizerId: 2,
        name: "group2",
        about: "Erat nam at lectus urna duis convallis convallis. Eget dolor morbi non arcu risus quis varius quam quisque. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit. Pretium fusce id velit ut tortor. Ut tortor pretium viverra suspendisse potenti nullam ac tortor. Orci eu lobortis elementum nibh. A condimentum vitae sapien pellentesque habitant morbi tristique senectus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Imperdiet nulla malesuada pellentesque elit eget gravida. Fermentum iaculis eu non diam phasellus vestibulum. Platea dictumst quisque sagittis purus sit amet volutpat consequat. Ut ornare lectus sit amet est placerat in egestas. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Diam maecenas sed enim ut sem. Odio ut enim blandit volutpat maecenas volutpat blandit. In hac habitasse platea dictumst vestibulum rhoncus. Tortor consequat id porta nibh. Nulla facilisi nullam vehicula ipsum a arcu.",
        type: "Online",
        private: true,
        city: "kjasbg asgas",
        state: "AA"
      },
      {
        organizerId: 3,
        name: "group3",
        about: "Pretium fusce id velit ut tortor. Ut tortor pretium viverra suspendisse potenti nullam ac tortor. Orci eu lobortis elementum nibh. A condimentum vitae sapien pellentesque habitant morbi tristique senectus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Imperdiet nulla malesuada pellentesque elit eget gravida. Fermentum iaculis eu non diam phasellus vestibulum. Platea dictumst quisque sagittis purus sit amet volutpat consequat. Ut ornare lectus sit amet est placerat in egestas. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Diam maecenas sed enim ut sem. Odio ut enim blandit volutpat maecenas volutpat blandit. In hac habitasse platea dictumst vestibulum rhoncus. Tortor consequat id porta nibh. Nulla facilisi nullam vehicula ipsum a arcu.",
        type: "In person",
        private: false,
        city: "Oak Place",
        state: "LL"
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
        [Op.in]: ["group1", "group2", "group3"]
      }
    }, {})
  }
};
