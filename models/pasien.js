'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pasien = sequelize.define('Pasien', {
    name: {
          type: DataTypes.STRING,
          validate : {
            notEmpty : true
          }
    },
    contact: { type : DataTypes.STRING,
            validate : {
              notEmpty : true,
            }
          },
    email: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
                isUnique: function (value, next) {
                    var self = this;
                    Pasien.find({where: {email: value}})
                        .then(function (Pasien) {
                            // reject if a different user wants to use the same email
                            if (Pasien && Pasien.id !== Pasien.id) {
                                return next('Email already in use!');
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            }
        },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Pasien.associate = function (models) {
    Pasien.hasMany(models.Booking)
  }

  return Pasien;
};
