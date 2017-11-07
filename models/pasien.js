'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pasien = sequelize.define('Pasien', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Pasien;
};