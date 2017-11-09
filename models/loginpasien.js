'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var Loginpasien = sequelize.define('Loginpasien', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    PasienId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Loginpasien.beforeCreate((login, options) => {
    const saltRounds = 10;
    const myPlaintextPassword = login.password;
    return bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
      login.password = hash
    });
  });

  return Loginpasien;
};