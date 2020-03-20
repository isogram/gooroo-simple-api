'use strict';
module.exports = (sequelize, DataTypes) => {
  const CheckOut = sequelize.define('CheckOut', {
    bookID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    checkOutDate: DataTypes.DATE
  });
  CheckOut.associate = function(models) {
    CheckOut.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userID'
    });
    CheckOut.belongsTo(models.Book, {
      as: 'book',
      foreignKey: 'bookID'
    });
  };
  return CheckOut;
};