'use strict';
module.exports = (sequelize, DataTypes) => {
  var Booking = sequelize.define('Booking', {
    JadwalId: DataTypes.INTEGER,
    PasienId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Booking.associate = function (models) {
    Booking.belongsTo(models.Jadwal);
    Booking.belongsTo(models.Pasien);
  }

  return Booking;
};