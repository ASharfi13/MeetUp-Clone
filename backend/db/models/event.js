'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true
      })

      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId",
        as: "Attendees"
      })

      Event.belongsTo(models.Venue, {
        foreignKey: "venueId",
      })

      Event.belongsTo(models.Group, {
        foreignKey: "groupId",
      })
    }
  }
  Event.init({
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        isAtLeast50Char(value) {
          if (value.length < 5) {
            throw new Error("Must be at least 5 Characters");
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      isValidType(value) {
        validTypes = ['Online', 'In person']
        if (!validTypes.includes(value)) {
          throw new Error('Invalid Group Type. Please specifiy if Online or In person. ')
        }
      }
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.NUMERIC(3, 2),
    startDate: {
      type: DataTypes.DATEONLY,
      validate: {
        isAfter: '2023-12-4'
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      validate: {
        isAfterStartDate() {
          if (this.endDate && this.startDate && this.endDate < this.startDate) {
            throw new Error("Invalid EndDate! Please enter EndDate after Start Date!")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Event;
};
