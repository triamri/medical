'use strict';
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
  return Logindokter;
};