'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var Logindokter = sequelize.define('Logindokter', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    DokterId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Logindokter.beforeCreate((login, options) => {
    const saltRounds = 10;
    const myPlaintextPassword = login.password;
    return bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
      login.password = hash
    });
  });

  return Logindokter;
};