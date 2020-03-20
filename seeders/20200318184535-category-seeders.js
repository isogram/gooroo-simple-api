'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      {
        name: 'Fantasy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biography',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Romance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Technology',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Science Fiction',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Categories', null, {});
  }
};
