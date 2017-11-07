'use strict';
module.exports = (sequelize, DataTypes) => {
  var Hari = sequelize.define('Hari', {
    hari: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Hari;
};