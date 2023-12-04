'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsTo(models.Group, {
        foreignKey: "groupId"
      })
      Venue.hasMany(models.Event, {
        foreignKey: "venueId",
        onDelete: "CASCADE",
        hook: true
      })
    }
  }
  Venue.init({
    groupId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      validate: {
        isAddressEmpty(value) {
          if (value.length === 0) {
            throw new Error("Street Address is required")
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        isCityEmpty(value) {
          if (value.length === 0) {
            throw new Error("City is required")
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        isNotEmptyAndValidStateStr(value) {
          if (value.length === 0) {
            throw new Error("State is required")
          }

          if (!/^[A-Z]{2}$/.test(value)) {
            throw new Error("State must be 2 Uppercase Letters")
          }
        },
      },
    },
    lat: DataTypes.NUMERIC(10, 7),
    lng: DataTypes.NUMERIC(10, 7)
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
