'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    publisher: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {});
  Book.associate = function(models) {
    Book.belongsToMany(models.Category, {
      through: 'BookCategories',
      as: 'categories',
      foreignKey: 'bookID'
    });
    Book.hasOne(models.CheckOut, {
      through: 'CheckOuts',
      as: 'borrowed_by',
      foreignKey: 'bookID'
    });
    Book.belongsTo(models.User, {
      through: 'Users',
      as: 'user',
      foreignKey: 'userID'
    });
  };
  return Book;
};