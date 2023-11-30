'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
      })

      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId"
      })

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: "groupId",
        otherKey: "userId",
        as: "members"
      })

      Group.belongsTo(models.User, {
        foreignKey: "organizerId", as: "Organizer"
      })

      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true
      })
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: DataTypes.STRING(60),
    about: {
      type: DataTypes.TEXT,
      validate: {
        isAtLeast50Char(value) {
          if (value.length < 50) {
            throw new Error("Must be at least 50 Characters");
          }
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isValidType(value) {
          const validTypes = ['Online', 'In person']
          if (!validTypes.includes(value)) {
            throw new Error('Invalid Group Type. Please specifiy if Online or In person. ')
          }
        }
      }
    },
    private: DataTypes.BOOLEAN,
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUppercase: true,
        len: [2, 2]
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
