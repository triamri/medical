'use strict';
module.exports = (sequelize, DataTypes) => {
  var Dokter = sequelize.define('Dokter', {
    name: DataTypes.STRING,
    alamat: DataTypes.STRING,
    contact: DataTypes.STRING,
    email: DataTypes.STRING,
    KategoriId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Dokter.associate = function(models){
    Dokter.belongsTo(models.Kategori);
    Dokter.hasMany(models.Jadwal)
  }

  return Dokter;
};
