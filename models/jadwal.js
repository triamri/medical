'use strict';
module.exports = (sequelize, DataTypes) => {
  var Jadwal = sequelize.define('Jadwal', {
    jambuka: DataTypes.STRING,
    jamtutup: DataTypes.STRING,
    DokterId: DataTypes.INTEGER,
    HariId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  Jadwal.associate = function(models){
      Jadwal.belongsTo(models.Hari);
      Jadwal.belongsTo(models.Dokter);
      Jadwal.hasMany(models.Booking);
  }
  return Jadwal;
};
