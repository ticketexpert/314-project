'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Events', [
      {
        title: 'Tech Conference 2025',
        type: 'conference',
        date: new Date('2025-05-01'),
        description: 'Annual technology conference featuring industry leaders',
        price: 299.99,
        location: 'Sydney',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Summer Music Festival',
        type: 'festival',
        date: new Date('2025-01-15'),
        description: 'Three day outdoor music festival',
        price: 150,
        location: 'Melbourne',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Business Workshop',
        type: 'workshop',
        date: new Date('2025-03-20'),
        description: 'Professional development and networking event',
        price: 75,
        location: 'Brisbane',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
  }
}; 