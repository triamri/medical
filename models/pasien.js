'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pasien = sequelize.define('Pasien', {
    name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: 3,
                    msg: "Name must be atleast 3 characters in length"
                }
            }
        },
    contact: DataTypes.STRING,
    email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
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
  return Pasien;
};
