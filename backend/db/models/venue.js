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
        onDelete: "SET NULL",
        hook: true
      })
    }
  }
  Venue.init({
    groupId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
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
