'use strict';
module.exports = (sequelize, DataTypes) => {
  const BookCategory = sequelize.define('BookCategory', {
    bookID: DataTypes.INTEGER,
    categoryID: DataTypes.INTEGER
  });
  BookCategory.associate = function(models) {
    models.Book.belongsToMany(models.Book, {
      through: 'BookCategories',
      as: 'books',
      foreignKey: 'bookID'
    });
    models.BookCategory.belongsTo(models.Category, {
      through: 'BookCategories',
      as: 'categories',
      foreignKey: 'categoryID'
    });
  };
  return BookCategory;
};