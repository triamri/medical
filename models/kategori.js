'use strict';
module.exports = (sequelize, DataTypes) => {
  var Kategori = sequelize.define('Kategori', {
    kategori: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Kategori;
};