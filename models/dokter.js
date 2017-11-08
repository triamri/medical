'use strict';
module.exports = (sequelize, DataTypes) => {
  var Dokter = sequelize.define('Dokter', {
    name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: 3,
                    msg: "Name must be atleast 3 characters in length"
                }
            }
        },
    alamat: DataTypes.STRING,
    contact: { type: DataTypes.STRING, allowNull: false,},
    email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isUnique: function (value, next) {
                    var self = this;
                    Dokter.find({where: {email: value}})
                        .then(function (Dokter) {
                            // reject if a different user wants to use the same email
                            if (Dokter && Dokter.id !== Dokter.id) {
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
