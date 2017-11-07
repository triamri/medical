'use strict';
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
  return Loginpasien;
};