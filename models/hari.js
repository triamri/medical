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
  Hari.associate = function(models){
    Hari.hasMany(models.Jadwal)
  }
  return Hari;
};
