'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: "Must be valid email format"
        },
        isUnique(value, next) {
          User.findOne({
            where: {
              email: value
            },
            attributes: ['id']
          }).done((user) => {
            if (user)
              return next('Email already registered');

            next();
          });
        }
      }
    },
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, 15);
      }
    }
  });
  User.associate = function(models) {
    User.hasMany(models.Book, {
      as: 'books',
      foreignKey: 'userID'
    });
    User.hasMany(models.CheckOut, {
      as: 'checkouts',
      foreignKey: 'userID'
    });
  };
  return User;
};