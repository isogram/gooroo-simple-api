'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CheckOuts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Books',
          key: 'id'
        }
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      checkOutDate: {
        type: Sequelize.DATE
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CheckOuts');
  }
};